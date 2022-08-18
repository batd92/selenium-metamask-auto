import { Browser } from '../lib';
import { PagesKDG } from '../pages/kdg';

export const _moduleKDG = async (driver: any) => {
  let pages: PagesKDG;
  pages = new PagesKDG(new Browser(driver));
  await pages.home.navigate();
  await pages.home._connectModule();
};