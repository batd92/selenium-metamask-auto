const selectors = {
  // Memo: Edit -> EditSuggestedGasFee - > gasLimit -> gasPrice -> Save -> Confirm
  btnEdit: '#app-content > div > div.main-container-wrapper > div > div.confirm-approve-content.confirm-approve-content--full > div.confirm-approve-content__card-wrapper > div > div.confirm-approve-content__card-header > div.box.box--flex-direction-row.box--width-1\/6 > a',
  btnEditSuggestedGasFee: `#popover-content > div > div > section > div.box.popover-content.box--rounded-xl.box--display-flex.box--justify-content-flex-start.box--align-items-stretch.box--flex-direction-column > div > div.edit-gas-display > div.edit-gas-display__content > button`,
  gasLimit: `#popover-content > div > div > section > div.box.popover-content.box--rounded-xl.box--display-flex.box--justify-content-flex-start.box--align-items-stretch.box--flex-direction-column > div > div.edit-gas-display > div.edit-gas-display__content > div.advanced-gas-controls > div:nth-child(1) > label > div.numeric-input > input[type=number]`,
  gasPrice: '#popover-content > div > div > section > div.box.popover-content.box--rounded-xl.box--display-flex.box--justify-content-flex-start.box--align-items-stretch.box--flex-direction-column > div > div.edit-gas-display > div.edit-gas-display__content > div.advanced-gas-controls > div:nth-child(2) > label > div.numeric-input > input[type=number]',
  btnSave: '#popover-content > div > div > section > div.box.popover-footer.box--padding-top-4.box--padding-right-6.box--padding-bottom-6.box--padding-left-6.box--display-flex.box--justify-content-space-between.box--flex-direction-row > button',
  btnConfirm: '#app-content > div > div.main-container-wrapper > div > div.page-container__footer > footer > button.button.btn--rounded.btn-primary.page-container__footer-button'
};

export default selectors;
