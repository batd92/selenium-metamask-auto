import { WebDriver, By } from 'selenium-webdriver';

import { TByOptions } from './_types';

export const findElement = async (driver: WebDriver, selector: string, by: TByOptions = By.css) => {
  return await driver.findElement(by(selector));
};
