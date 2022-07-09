import { Browser, Page } from '../../lib';
import config from '../../../config';
import * as kgdActions from '../kdg/actions';

export class HomePage extends Page {
  constructor(browser: Browser) {
    super(browser);
    this.setUrl(`${config.baseUrl}/`);
  }
  async _connectModule() {
    await kgdActions.clickBtnStarConnectWallet(await this.browser._driver());
    await kgdActions.clickBtnCnMetaMask(await this.browser._driver());
  }
}
