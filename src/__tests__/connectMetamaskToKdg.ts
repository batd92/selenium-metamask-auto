import * as metamaskWelcomeActions from '../pages/metamask/welcome/actions';

export const connectMetamaskToKdg = async (driver: any) => {
  if (driver) {
    try {
      const windows = await driver.getAllWindowHandles();
      await driver.switchTo().window(windows[2]);

      // Memo: BtnNext -> BtnConnect -> BtnApprove -> BtnSwitchNetwork
      await metamaskWelcomeActions.clickBtnNext(driver);
      await metamaskWelcomeActions.clickBtnConnect(driver);
      await metamaskWelcomeActions.clickBtnApprove(driver);
      await metamaskWelcomeActions.clickBtnSwitchNetwork(driver);
      await driver.switchTo().window(windows[0]);
    } catch (e) {
      console.log(e);
    } finally {
      // await driver.quit();
    }
  }
};
