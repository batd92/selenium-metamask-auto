import { WebDriver } from 'selenium-webdriver';

import { clickElement, getElement, isEnabled, isDisplayed} from '../../../src/utils/helpers/actions';
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

export const clickBtnClaim = async (driver: WebDriver) => {
  await clickElement(driver, selectors.btnClaim);
};

export const _isEnabled = async (driver: WebDriver) => {
  await isEnabled(driver, selectors.btnClaim);
};

export const _checkBtnClaimDisplay = async (driver: WebDriver) => {
  const result = await isDisplayed(driver, selectors.btnClaim);
  return result;
};