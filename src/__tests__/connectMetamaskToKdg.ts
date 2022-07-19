import * as metamaskWelcomeActions from '../pages/metamask/welcome/actions';

export const connectMetamaskToKdg = async (driver: any) => {
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

      // Memo: BtnNext -> BtnConnect -> BtnApprove -> BtnSwitchNetwork
      await driver.sleep(5000);
      await metamaskWelcomeActions.clickBtnNext(driver);
      await metamaskWelcomeActions.clickBtnConnect(driver);
      await metamaskWelcomeActions.clickBtnApprove(driver);
      await metamaskWelcomeActions.clickBtnSwitchNetwork(driver);
    } catch (e) {
      console.log(e);
    } finally {
      // await driver.quit();
    }
  }
};
