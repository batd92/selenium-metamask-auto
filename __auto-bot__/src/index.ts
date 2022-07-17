import { ETHER, ChainId, Percent, Router, Token, Trade, Fetcher } from "@pancakeswap/sdk";
import ERC20 from './abis/ERC20.json';
import pancakeswapABI from './abis/pancakeswap-factory-v2.json';
import IPancakeRouter from './abis/IPancakeRouter.json';
import { activateAccount, wallet, web3 } from './wallet'
import { useAllCommonPairs, getContractToken } from "./helper";
import { config, provider, WBNB } from "./config";
import { parseUnits} from '@ethersproject/units'
import { logger} from "./utils/logger";
import { Contract, ethers} from "ethers";
import isZero from "./utils/int";
import { tryParseAmount} from "./utils/wrappedCurrency";
import { sleep } from "./utils/utils";
import EventEmitter from "events";
import { AbiItem } from 'web3-utils'

const schedule = require('node-schedule');
const JSBI = require('jsbi');

const BIPS_BASE = JSBI.BigInt(10000)
const pancakeswapRouterAddress = '0x10ED43C718714eb63d5aA57B78B54704E256024E';

const routerContract = new web3.eth.Contract(IPancakeRouter as AbiItem[], pancakeswapRouterAddress); // Hợp đồng định tuyến

const outputAddress = config.SWAP_OUTPUT_TOKEN;

const ERROR = 'Insufficient liquidity for this trade.';

// Giám sát các thay đổi của khối
(() => {
    const contract = new ethers.Contract(outputAddress, ERC20, provider).connect(wallet)
    contract.on('Transfer', function (from, to, amount) {
        // logger.warn("Transfer.event: ", from, to, amount.toString())
        // console.log('started event1');
        // console.log("purchaser:" + purchaser);
        // console.log("value:" + value);
        // console.log("amount:" + amount, typeof amount);
    })
})();

enum TaskStep {
    Selling,
    Buying
}

enum SellType {
    None = 0,
    TakeProfit = 1,
    StopLoss = 2,
}

const task = {
    tradeAmount: "0.1",// Số lượng đổi
    swapOptions: {
        feeOnTransfer: false,
        allowedSlippage: new Percent(JSBI.BigInt(Math.floor(1200)), BIPS_BASE), //12%
        recipient: activateAccount.address, //account address
        ttl: 60 * 2, //2min
    },
    tradeOptions: {
        maxHops: 3,
        maxNumResults: 1
    },
    _loaded: false, // Tải lại
    _buyedPrice: 0, //giá mua
    MAX_TAKE_PROFIT_POINT: 1, //翻倍pec
    MIN_STOP_LOSS_POINT: 0.5, //Bán với giá thấp nhất
    wallet: {
        outputAmount: "0",
    },
    step: TaskStep.Buying, //Mua
    swap: {
        currentPrice: "",
    }
}

class Monitor extends EventEmitter {
    private swapper: any

    constructor(swapper) {
        super();
        this.swapper = swapper
    }

    private running: boolean = false;

    private liquidity = false;

    start() {
        this.running = true
        this.run().then()
        this.monitWallet().then()
    }

    private async fetchTrade() {
        try {
            const amount = task.tradeAmount
            const trade = await this.swapper.GetBuyTrade(amount)
            const oldQ = this.liquidity;
            const newQ = !!trade;
            if (oldQ !== newQ) {
                this.emit('liquidity.on', trade) //Có thanh khoản giao dịch
            }
            this.liquidity = newQ
            if (!trade) {
                return
            }
            this.emit('liquidity.timer', amount, trade) //Có thanh khoản giao dịch
        } catch (e) {
            console.error('fetchTrade ===> ', e.message)
        }
    }

    private async run() {
        while (this.running) {
            await sleep(500)
            await this.fetchTrade()
        }
        // //Thời gian này không thể quá ngắn, nếu không bạn sẽ bị cấm
        // schedule.scheduleJob('*/1 * * * * *', async () => {
        //     await this.fetchTrade()
        // });
    }

    private async monitWallet() {
        try {
            while (this.running) {
                await sleep(500)
                let {output, outputAmount, inputAmount} = await this.swapper.getBalances();
                const am = {outputAmount: outputAmount, amount: outputAmount.toString(), inputAmount }
                this.emit('wallet.update.output_token', am);
                if (!task._loaded) {
                    task._loaded = true
                    this.emit('wallet.loaded', am)
                }
            }   
        } catch (error) {
            console.log('monitWallet ===> ' + error);
        }
    }

    private async monitorSwap() {
        //1w * 300
    }
}

const scheduleMonitor = async () => {
    const swapper = new Swapper(outputAddress);
    await swapper.init() // Khởi tạo thông tin hợp đồng
    const monitor = new Monitor(swapper);
    monitor.start()

    // Check liquidity changed
    monitor.on('liquidity.on', (trade) => {
        logger.warn("liquidity changed")
    })

    monitor.on('liquidity.timer', async (amount, trade) => {
        const info = swapper.printTrade("liquidity.timer", amount, trade)
        // Đặt giá hiện tại
        task.swap.currentPrice = info.executionPrice;
        logger.trace(`swap.price.update: ${task.wallet.outputAmount} / percent:${swapper.getPrc(task.swap.currentPrice).toFixed(5)} / [C=${task.swap.currentPrice},B=${task._buyedPrice}]`) //Giá hiện tại
        if (task._buyedPrice <= 0) return;
        await swapper.autoSell(task.wallet.outputAmount, info) //Bán
    })

    // Tự động bán khi đạt đến bội số nhất định
    monitor.on('wallet.update.output_token', async (wallet) => {
        if (task.wallet.outputAmount !== wallet.amount && task._buyedPrice) {
            logger.trace(`wallet.update.output_token: ${wallet.amount} / ${swapper.getPrc(task.swap.currentPrice).toFixed(5)}`) //Giá hiện tại
        }
        task.wallet.outputAmount = wallet.amount;
    })

    let running = false;
    // Load lại ví
    monitor.on('wallet.loaded', (wallet) => {
        running = true;
        logger.warn("wallet loaded:", wallet)
    })

    // Thực hiện ở giây thứ 30 mỗi phút: //future will set a loop under bsc requests limit instead of a timer schedule
    schedule.scheduleJob('*/1 * * * * *', async () => {
        if (!running) return;
        try {
            const amount = task.tradeAmount;
            const trade = await swapper.GetBuyTrade(amount);
            if (!trade) {
                logger.trace("GetBuyTrade:", ERROR);
                return
            }
            await swapper.doBuyTrade(amount, trade);
        } catch (e) {
            console.error(e.message)
        }
    });
}

export class Swapper {
    private outputToken: any;
    private readonly outputTokenAddress: string;
    private outputTokenContract
    private inputTokenContract;

    private inputToken: Token = WBNB;
    private tradeOptions = {
        maxHops: 3,
        maxNumResults: 1,
        ...task.tradeOptions
    };
    private swapOptions = {
        feeOnTransfer: false,
        allowedSlippage: new Percent(JSBI.BigInt(Math.floor(1200)), BIPS_BASE), //Trượt phần trượt giá
        recipient: activateAccount.address, //account address
        ttl: 60 * 2, //2min,
        ...task.swapOptions
    }

    private accountContract: Contract;
    private accountSwapContract: Contract;

    private isTrading = false;
    private cached: any = {route: "", price: "",};

    constructor(outAddress: string) {
        this.outputTokenAddress = outAddress
        this.accountContract = new ethers.Contract(this.inputToken.address, ERC20, provider)
        this.accountContract = this.accountContract.connect(wallet)
        this.accountSwapContract = new ethers.Contract(pancakeswapRouterAddress, pancakeswapABI, provider).connect(wallet)
    }

    async init() {
        try {
            // Init contract
            const {tokenOutput} = await getContractToken(this.outputTokenAddress);
            this.outputToken = tokenOutput
            logger.info(`OutputToken loaded:${this.outputTokenAddress} / ${this.outputToken.symbol} / ${this.outputToken.decimals}`)

            //1.授权output Token交易
            // await this.approve(this.inputToken.address, MaxUint256)
            // await this.approve(this.outputToken.address, MaxUint256)
            // await this.approve(BUSD.address, MaxUint256) //授权

            this.inputTokenContract = new ethers.Contract(this.inputToken.address, ERC20, provider)
            this.outputTokenContract = new ethers.Contract(this.outputToken.address, ERC20, provider)
        } catch (error) {
            console.log(error);
        }
    }

    private async approve(spender: string, amount: any) {
        const add = await this.accountContract.allowance(wallet.address, spender)
        const apped = ethers.BigNumber.from(add)
        if (!apped.gt(0)) {
            const res = await this.accountContract.approve(spender, amount) //授权
            logger.warn(`approved: ${spender}`, apped.toString())
        }
    }

    // Nhận danh sách các cặp giao dịch (pairs)
    async getPairs(): Promise<any> {
        return useAllCommonPairs(this.inputToken, this.outputToken)
    }

    // Get số dư của tài khoản ví
    async getBalances(): Promise<any> {
        const walletAddress = await wallet.getAddress();
        const outputBalance = await this.outputTokenContract.balanceOf(walletAddress) ///Số lượng mã thông báo đầu ra
        const valB = ethers.utils.formatUnits(outputBalance, this.outputToken.decimals).toString(); //Số dư BNB
        const inputAmount = await this.inputTokenContract.balanceOf(walletAddress) ///Số lượng mã thông báo đầu ra
        const inputAmountG = ethers.utils.formatUnits(inputAmount, this.inputToken.decimals).toString();
        console.log('inputAmountG ', inputAmountG);
        return {output: outputBalance, outputAmount: valB, inputAmount}
    }

    async GetBuyTrade(amount) {
        const pairsList = await useAllCommonPairs(this.inputToken, this.outputToken);
        const curr = tryParseAmount(amount, ETHER) //parse amount Chỉ được gọi với ETHER mặc định swapExactETHForTokens
        return Trade.bestTradeExactIn(pairsList, curr, this.outputToken, this.tradeOptions)[0] ?? null
    }

    async GetSellTrade(amount) {
        const pairsList = await this.getPairs();
        const ip = this.outputToken
        // const op = this.inputToken //将什么给换出来
        const op = ETHER //BNB换出来
        const curr = tryParseAmount(amount, ip) //换出来
        return Trade.bestTradeExactIn(pairsList, curr, op, this.tradeOptions)[0] ?? null
    }

    tradeInfo(trade) {
        const executionPrice = trade.executionPrice.invert().toSignificant(6);
        const nextMidPrice = trade.nextMidPrice.invert().toSignificant(6);
        const outputAmount = trade.outputAmount.toSignificant(6);
        const inputAmount = trade.inputAmount.toSignificant(6);
        const priceImpact = trade.priceImpact.toSignificant(6);
        return {executionPrice, nextMidPrice, outputAmount, inputAmount, priceImpact}
    }

    /**
     * Get fee gas
     * @param parameters 
     * @param options 
     * @returns 
     */
    private async gas(parameters, options): Promise<any> {
        return await this.accountSwapContract.estimateGas[parameters.methodName](...parameters.args, options);
    }

    async execSwap(amount: string, trade) {
        try {
            const info = this.tradeInfo(trade) // Thông tin giao dịch
            const startTime = Date.now()
            const parameters = Router.swapCallParameters(trade, this.swapOptions)
            const encoded_tx = routerContract.methods[parameters.methodName](...parameters.args).encodeABI();
            amount = ethers.utils.formatEther(parameters.value)
            const value = parseUnits(amount, trade.inputAmount.decimals);
            let transactionObject: any = {
                gasLimit: 475147,
                data: encoded_tx,
                from: activateAccount.address,
                to: pancakeswapRouterAddress,
                value: value,
            };
            task._buyedPrice = info.executionPrice;
            let routeTag = `Swap:[${trade.inputAmount.currency.symbol}->${trade.outputAmount.currency.symbol}][price=${task._buyedPrice}]`
            let gas: any = "";
            try {
                const value = parameters.value;
                const options = !value || isZero(value) ? {} : {value}
                gas = await this.gas(parameters, options)
            } catch (e) {
                logger.error("gas.error:", e.reason)
            }
            if (gas) {
                // transactionObject.gasLimit = gas.toNumber() * 3 // Tăng gấp 3 lần fee gas
            }
            const wasteGas = Date.now() - startTime
            logger.trace(`Start.swap: ${routeTag} | ${parameters.methodName}, gasLimit:${gas.toString()} / Time:${wasteGas}ms,value: ${ethers.utils.formatUnits(value, trade.inputAmount.decimals).toString()}`)
            const res = await wallet.sendTransaction(transactionObject);
            const receipt = await res.wait(); // Đang chờ xác nhận khối
            const transTime = Date.now() - startTime
            if (receipt.status) {
                logger.info(`Transaction.success: ${routeTag} gasUsed:${receipt.gasUsed.toString()},time:${transTime}ms,confirmations:${receipt.confirmations}`);
                task.step = TaskStep.Selling; // Đã mua thành công
            } else {
                logger.error("Swap.error:", receipt)
            }
        } catch (e) {
            logger.error("execSwapSell:", e.reason)
        }
        return
    }

    printTrade(tag: string, amount, trade) {
        const info = this.tradeInfo(trade)
        const old = {...this.cached}
        this.cached.route = SwapRoutePrint(trade).join('->')
        this.cached.price = info.executionPrice
        if (this.cached.route != old.route || this.cached.price != old.price) {
            logger.warn(`[${tag}]Route.stateChange: ${SwapRoutePrint(trade).join('->')} / Price:${info.executionPrice},Input:${info.inputAmount},Output:${info.outputAmount}`)
        }
        return info
    }

    //do buy
    async doBuyTrade(amount, trade) {
        const info = this.tradeInfo(trade)
        amount = info.inputAmount;
        if (!this.isTrading && this.canBuyMore()) {
            this.isTrading = true
            // await this.execSwap(amount, trade).finally(() => {
            //     this.isTrading = false
            // })
        }
    }

    // Có thể mua thêm ?
    private canBuyMore(): boolean {
        if (!task._loaded) return false;//Load lại task
        if (this.isSelling) return false;//Bán không ?
        return task.step === TaskStep.Buying;
    }

    // Bán
    private isSelling = false;//Nó có được bán không

    public getPrc(currentPrice) {
        return (currentPrice / task._buyedPrice)
    }

    private async _doSell(amount, currentPrice) {
        try {
            const prc = (currentPrice / task._buyedPrice)
            let needSellType = SellType.None;
            if (prc >= task.MAX_TAKE_PROFIT_POINT) {
                needSellType = SellType.TakeProfit
            }
            if (prc <= task.MIN_STOP_LOSS_POINT) {
                needSellType = SellType.StopLoss
            }
            if (needSellType === SellType.None) return; // Unknown
            logger.trace(`AutoSell->[${prc},${needSellType}]->BuyPrice:${task._buyedPrice}->CurrentPrice:${currentPrice},amount:${task.wallet.outputAmount}`)
            const trade = await this.GetSellTrade(amount);
            console.log('trade ', trade);
            if (!trade) {
                logger.trace("SellTrade:", ERROR);
                return
            }
            const info = this.tradeInfo(trade)
            amount = info.inputAmount;
            await this.execSwap(amount, trade);
        } catch (e) {
            console.error(e.message)
        }
    }

    public async autoSell(amount, info) {
        if (this.isSelling) return; //Kết thúc
        this.isSelling = true;
        await this._doSell(amount, info.executionPrice).finally(() => {
            this.isSelling = true;
        })
    }
}

scheduleMonitor();

function SwapRoutePrint(trade: Trade) {
    return trade.route.path.map((token, i, path) => {
        return token.symbol
    })
}
