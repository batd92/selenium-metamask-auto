import { WebDriver } from 'selenium-webdriver';

import { findElement, findElementAndCheckDisplay } from './elements';
import { TByOptions } from './_types';

export const clickElement = async (driver: WebDriver, selector: string, by?: TByOptions) => {
  try {
    const element = await findElement(driver, selector, by);
    if (element) {
      await element.click();
    }
  } catch (error) {
    console.log('Click element error: ', error);
  }
};

export const getElement = async (driver: WebDriver, selector: string, by?: TByOptions) => {
  try {
    const element = await findElement(driver, selector, by);
    if (element) {
      return element
    }
    return undefined;
  } catch (error) {
    console.log('Get element error: ', error);
  }
};

export const isEnabled = async (driver: WebDriver, selector: string, by?: TByOptions) => {
  try {
    const element = await findElement(driver, selector, by);
    if (element) {
      return element.isEnabled()
    }
    return false;
  } catch (error) {
    return false;
  }
};

export const isDisplayed = async (driver: WebDriver, selector: string, by?: TByOptions) => {
  try {
    return findElementAndCheckDisplay(driver, selector, by);
  } catch (error) {
    console.log('Is Enabled error: ', error);
  }
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
