import { Browser, Page } from '../../lib';
import config from '../../../config';
import * as kgdActions from '../kdg/actions';

export class HomePage extends Page {
  constructor(browser: Browser) {
    super(browser);
    this.setUrl(`${config.baseUrl}/`);
  }
  async _connectModule() {
    try {
      await kgdActions.closeAlertError(await this.browser._driver());
      await kgdActions.clickBtnStarConnectWallet(await this.browser._driver());
      await kgdActions.clickBtnCnMetaMask(await this.browser._driver());
    } catch (error) {
      console.log('_connectModule error: ', error);
      // process.exit();
    }
  }
}
