import { ChainId, Token, WETH } from "@pancakeswap/sdk";
import * as ethers from "ethers";
import env from 'dotenv'

const envConfig = env.config();
export const config: any = {
    id: 1,
    name: 'BSC Mainnet',
    provider: 'https://bsc-dataseed.binance.org/',
    scan: 'https://api.bscscan.com/api',
    ws: "wss://bsc-ws-node.nariox.org:443",
    walletPvKey: "",
    ...envConfig.parsed,
};
config.walletPvKey = (config.WALLET_PRIVATE_KEY).toString();
config.ROUTE_ADDRESS = '0x10ED43C718714eb63d5aA57B78B54704E256024E'
config.SWAP_OUTPUT_TOKEN = '0xd2F9b95370908CC2757DDEb4d0DdDd29f1C40D69';
export const provider = new ethers.providers.JsonRpcProvider(config.provider);

//BSC chain
export const WBNB = WETH[56];
export const BUSD = new Token(ChainId.MAINNET, '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56', 18, 'BUSD', 'Binance USD')
export const USDT = new Token(ChainId.MAINNET, '0x55d398326f99059fF775485246999027B3197955', 18, 'USDT', 'Tether USD')
export const TRADE_TOKENS = [WBNB, BUSD, USDT];
