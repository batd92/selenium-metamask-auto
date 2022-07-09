import { HomePage } from './HomePage';
import { Browser } from '../../lib/browser';

export {
  HomePage,
};

export class PagesKDG {
    public home: HomePage;

    constructor(public browser: Browser) {
      this.home = new HomePage(browser);
    }

    public async dispose(): Promise<void> {
      await this.browser.close();
    }
}
