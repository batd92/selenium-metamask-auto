import * as metamaskTransactionActions from '../pages/metamask/transaction/actions';
import { GasPrice, GasLimit } from '../utils/_consts';

export const _moduleEditTransaction = async (driver: any) => {
  if (driver) {
    try {
      let loop = true;
      while (loop) {
        const windows = await driver.getAllWindowHandles();
        if (windows.length === 3) {
          loop = false;
          await driver.switchTo().window(windows[2]);
        }
      }
      // Memo: Close Dark Mode -> Edit -> EditSuggestedGasFee - > gasLimit -> gasPrice -> Save -> Confirm
      //  let darkMode = await metamaskTransactionActions.checkBtnDarkModeDisplay(driver);
      //  if (darkMode) {
      //    await metamaskTransactionActions.closeDarkMode(driver);
      // }
      await metamaskTransactionActions.clickBtnEdit(driver);
       let BtnEditSuggestedGasFee = await metamaskTransactionActions.checkBtnGasFee(driver);
       if (BtnEditSuggestedGasFee) {  
        await metamaskTransactionActions.clickBtnEditSuggestedGasFee(driver); 
      }
      await metamaskTransactionActions.fillGasLimit(driver, GasLimit);
      await metamaskTransactionActions.fillGasPrice(driver, GasPrice);
      await metamaskTransactionActions.clickBtnSave(driver);
      await metamaskTransactionActions.clickBtnConfirm(driver);
    } catch (e) {
      console.log(e);
    } finally {
      // await driver.quit();
    }
  }
};