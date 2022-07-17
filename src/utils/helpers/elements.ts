import { WebDriver, By } from 'selenium-webdriver';

import { TByOptions } from './_types';

export const findElement = async (driver: WebDriver, selector: string, by: TByOptions = By.css) => {
  return await driver.findElement(by(selector));
};

export const findElementAndCheckDisplay = async (driver: WebDriver, selector: string, by: TByOptions = By.css) => {
  let element = true;
  try {
    element = await driver.findElement(by(selector)).isDisplayed();
  }
  catch (e) {
    element = false;
  }
  return element;
};
 