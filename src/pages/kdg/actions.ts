import { WebDriver } from 'selenium-webdriver';

import { clickElement, fillText } from '../../../src/utils/helpers/actions';
import selectors from './selectors';

export const closeAlertError = async (driver: WebDriver) => {
  await clickElement(driver, selectors.btnAlertError);
};

export const clickBtnStarConnectWallet = async (driver: WebDriver) => {
  await clickElement(driver, selectors.btnConnectWallet);
};

export const clickBtnCnMetaMask = async (driver: WebDriver) => {
  await clickElement(driver, selectors.btnCnMetammask);
};
