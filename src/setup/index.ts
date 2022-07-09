import { WebDriver, Builder, ThenableWebDriver } from 'selenium-webdriver';
import chromedriver from 'chromedriver';
import { Options as ChromeOptions } from 'selenium-webdriver/chrome';

import { BrowsersEnum } from '../utils/_types';
import { TSetup } from './_types';

chromedriver;

export const setupDriver = async ({ browser, options, hasExtension, timeout = 10000 }: TSetup) => {
  try {
    let builder = new Builder().forBrowser(browser);
    let driver: ThenableWebDriver;

    if (options) {
      if (browser === BrowsersEnum.Chrome) {
        driver = builder.setChromeOptions(options as ChromeOptions).build();
      }
      if (hasExtension) {
        // Switch to extension tab
        const handles = await driver.getAllWindowHandles();
        await driver.switchTo().window(handles[1]);
        // await driver.close();
        await driver.switchTo().window(handles[0]);
      }
    } else {
      driver = builder.build();
    }
    // Timeout
     driver.manage().setTimeouts({ implicit: timeout });

    return driver;
  } catch (error) {
    console.log(error);
  }
};
