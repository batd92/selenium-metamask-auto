import { WebDriver } from 'selenium-webdriver';

import { findElement } from './elements';
import { TByOptions } from './_types';

export const clickElement = async (driver: WebDriver, selector: string, by?: TByOptions) => {
  const element = await findElement(driver, selector, by);
  await element.click();
};

export const fillText = async (
  driver: WebDriver,
  selector: string,
  text: string,
  by?: TByOptions,
) => {
  const element = await findElement(driver, selector, by);
  await element.sendKeys(text);
};
