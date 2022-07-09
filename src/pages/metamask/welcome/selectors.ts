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
};

export default selectors;
