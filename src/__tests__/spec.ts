import { Browser } from '../lib';
import { PagesKDG } from '../pages/kdg';

async function _moduleKDG() {
  let pages: PagesKDG;
  pages = new PagesKDG(new Browser('chrome'));
  await pages.home.navigate();
  await pages.home._connectModule();
}
_moduleKDG();