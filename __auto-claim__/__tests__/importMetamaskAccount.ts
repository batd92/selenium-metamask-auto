import * as metamaskWelcomeActions from '../pages/metamask/welcome/actions';
import { FAKE_RECOVERY_PHRASE, FAKE_PASSWORD } from '../utils/_consts';

export const importMetamaskAccount = async (driver: any) => {
  if (driver) {
    try {
      let windows = await driver.getAllWindowHandles();
      await driver.switchTo().window(windows[0]);
      await metamaskWelcomeActions.clickBtnStartNow(driver);
      await metamaskWelcomeActions.clickBtnImportWallet(driver);
      await metamaskWelcomeActions.clickBtnNoThanks(driver);
      await metamaskWelcomeActions.fillRecoveryPhrase(driver, FAKE_RECOVERY_PHRASE);
      await metamaskWelcomeActions.fillNewPassword(driver, FAKE_PASSWORD);
      await metamaskWelcomeActions.fillConfirmPassword(driver, FAKE_PASSWORD);
      await metamaskWelcomeActions.checkTermsOfUse(driver);
      await metamaskWelcomeActions.clickBtnImport(driver);
      await driver.sleep(4000);
    } catch (e) {
      console.log(e);
    } finally {
      // await driver.quit();
    }
  }
};
