import { WebDriver } from 'selenium-webdriver';

import { clickElement, fillText, isDisplayed } from '../../../utils/helpers/actions';
import selectors from './selectors';

// Edit -> EditSuggestedGasFee - > gasLimit -> gasPrice -> Save -> Confirm

export const clickBtnEdit = async (driver: WebDriver) => {
  await clickElement(driver, selectors.btnEdit);
};

// export const clickBtnEditSuggestedGasFee = async (driver: WebDriver) => {
//   await clickElement(driver, selectors.btnEditSuggestedGasFee);
// };

export const fillGasLimit = async (driver: WebDriver, gasLimit: string) => {
  await fillText(driver, selectors.gasLimit, gasLimit);
};

export const fillGasPrice = async (driver: WebDriver, gasPrice: string) => {
  await fillText(driver, selectors.gasPrice, gasPrice);
};

export const clickBtnSave = async (driver: WebDriver) => {
  await clickElement(driver, selectors.btnSave);
};

export const clickBtnConfirm = async (driver: WebDriver) => {
  await clickElement(driver, selectors.btnConfirm);
};

export const checkBtnDarkModeDisplay = async (driver: WebDriver) => {
  const result = await isDisplayed(driver, selectors.btnDrakMode);
  return result;
};

export const closeDarkMode = async (driver: WebDriver) => {
  await clickElement(driver, selectors.btnDrakMode);
};
