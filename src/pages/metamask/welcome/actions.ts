import { WebDriver } from 'selenium-webdriver';

import { clickElement, fillText, getElement } from '../../../utils/helpers/actions';
import selectors from './selectors';

export const clickBtnStartNow = async (driver: WebDriver) => {
  await clickElement(driver, selectors.btnStartNow);
};

export const clickBtnImportWallet = async (driver: WebDriver) => {
  await clickElement(driver, selectors.btnImportWallet);
};

export const clickBtnNoThanks = async (driver: WebDriver) => {
  await clickElement(driver, selectors.btnNoThanks);
};

export const fillRecoveryPhrase = async (driver: WebDriver, phrase: string) => {
  const words = phrase.split(' ');
  for (let index = 0; index < words.length; index++) {
    const word = words[index];
    await fillText(driver, selectors.inputRecoveryPhrase + index, word);
  }
};

export const fillNewPassword = async (driver: WebDriver, password: string) => {
  await fillText(driver, selectors.inputNewPassword, password);
};

export const fillConfirmPassword = async (driver: WebDriver, password: string) => {
  await fillText(driver, selectors.inputConfirmPassword, password);
};

export const checkTermsOfUse = async (driver: WebDriver) => {
  await clickElement(driver, selectors.checkboxTermsOfUse);
};

export const clickBtnImport = async (driver: WebDriver) => {
  await clickElement(driver, selectors.btnImport);
};

export const clickBtnNext = async (driver: WebDriver) => {
  await clickElement(driver, selectors.btnNext);
};

export const clickBtnConnect = async (driver: WebDriver) => {
  await clickElement(driver, selectors.btnConnect);
};

export const clickBtnApprove = async (driver: WebDriver) => {
  await clickElement(driver, selectors.btnApprove);
};

export const clickBtnSwitchNetwork = async (driver: WebDriver) => {
  await clickElement(driver, selectors.btnSwitchNetwork);
};

export const getDoneElement = async (driver: WebDriver) => {
  await getElement(driver, selectors.btnDoneLogin);
};