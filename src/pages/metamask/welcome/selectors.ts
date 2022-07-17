const BTN_PRIMARY = 'button.btn-primary';
const BTN_SECONDARY = 'button.btn-secondary';

const selectors = {
  btnStartNow: BTN_PRIMARY,
  btnImportWallet: `.select-action__select-button:first-child ${BTN_PRIMARY}`,
  btnNoThanks: `.page-container__footer ${BTN_SECONDARY}`,
  inputRecoveryPhrase: '#import-srp__srp-word-',
  inputNewPassword: '#password',
  inputConfirmPassword: '#confirm-password',
  checkboxTermsOfUse: '#create-new-vault__terms-checkbox',
  btnImport: `.first-time-flow ${BTN_PRIMARY}`,
  btnDoneLogin: '//*[@id="app-content"]/div/div[2]/div/div/button',
  btnNext: '#app-content > div > div.main-container-wrapper > div > div.permissions-connect-choose-account__footer-container > div.permissions-connect-choose-account__bottom-buttons > button.button.btn--rounded.btn-primary',
  btnConnect: '#app-content > div > div.main-container-wrapper > div > div.page-container.permission-approval-container > div.permission-approval-container__footers > div.page-container__footer > footer > button.button.btn--rounded.btn-primary.page-container__footer-button',
  btnApprove: `#app-content > div > div.main-container-wrapper > div > div.confirmation-footer > div.confirmation-footer__actions > button.button.btn--rounded.btn-primary`,
  btnSwitchNetwork: `#app-content > div > div.main-container-wrapper > div > div.confirmation-footer > div.confirmation-footer__actions > button.button.btn--rounded.btn-primary`,
  btnDrakMode: "#popover-content > div > div > section > div.box.popover-header.box--rounded-xl.box--padding-top-6.box--padding-right-4.box--padding-bottom-4.box--padding-left-4.box--display-flex.box--flex-direction-column.box--background-color-background-default > div > button"
};

export default selectors;
