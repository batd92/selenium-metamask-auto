import { Options as OptionsChrome } from 'selenium-webdriver/chrome';

import { setupDriver } from '../setup';
import { BrowsersEnum } from '../utils/_types';
import * as metamaskWelcomeActions from '../pages/metamask/welcome/actions';
import { METAMASK_EXTENSION_PATH, FAKE_RECOVERY_PHRASE, FAKE_PASSWORD } from '../utils/_consts';

async function importMetamaskAccount() {
  const options = new OptionsChrome().addExtensions([METAMASK_EXTENSION_PATH]);
  let driver = await setupDriver({ browser: BrowsersEnum.Chrome, options, hasExtension: true });
  if (driver) {
    try {
      await metamaskWelcomeActions.clickBtnStartNow(driver);
      await metamaskWelcomeActions.clickBtnImportWallet(driver);
      await metamaskWelcomeActions.clickBtnNoThanks(driver);
      await metamaskWelcomeActions.fillRecoveryPhrase(driver, FAKE_RECOVERY_PHRASE);
      await metamaskWelcomeActions.fillNewPassword(driver, FAKE_PASSWORD);
      await metamaskWelcomeActions.fillConfirmPassword(driver, FAKE_PASSWORD);
      await metamaskWelcomeActions.checkTermsOfUse(driver);
      await metamaskWelcomeActions.clickBtnImport(driver);
    } catch (e) {
      console.log(e);
    }
    finally {
      // await driver.quit();
    }
  }
}

importMetamaskAccount();
