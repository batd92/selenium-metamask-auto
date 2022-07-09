import { Options as OptionsChrome } from 'selenium-webdriver/chrome';

import { setupDriver } from '../setup';
import { BrowsersEnum } from '../utils/_types';
import { METAMASK_EXTENSION_PATH } from '../utils/_consts';
import { importMetamaskAccount } from './importMetamaskAccount';
import { _moduleKDG } from './runAndCheckKDG';

async function _moduleRunMain() {
  // Init web driver
  const options = new OptionsChrome();
  options.addExtensions([METAMASK_EXTENSION_PATH]);
  options.addArguments("--start-fullscreen");
  let driver = await setupDriver({ browser: BrowsersEnum.Chrome, options, hasExtension: true });

  // Load metamask
  await importMetamaskAccount(driver);
  // Load kdg
  await _moduleKDG(driver);
}
_moduleRunMain();