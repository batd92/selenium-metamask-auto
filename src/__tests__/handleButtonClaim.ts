import * as kdgActions from '../pages/kdg/actions';
import * as Transaction from './metamaskTransaction';

export const _checkButtonClaim = async (driver: any) => {
  if (driver) {
    try {
      console.log('-------AutoClaim---------');
      const windows = await driver.getAllWindowHandles();
      await driver.switchTo().window(windows[0]);
      let runing = true;

      // Check button claim
      while(runing) {
        console.log('Đang quét button .... ');
        const isEnabled = kdgActions._isEnabled(driver);
        if (isEnabled) {
            await kdgActions.clickBtnClaim(driver);

            // Edit transaction
            await Transaction._moduleEditTransaction(driver);
            // Thoát vòng lặp
            runing = false;
        }
      }
    } catch (e) {
      console.log(e);
    } finally {
      // await driver.quit();
    }
  }
};
