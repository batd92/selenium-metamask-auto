import { BrowsersEnum, BrowsersOptions } from '../utils/_types';

export type TSetup = {
  browser: BrowsersEnum;
  options?: BrowsersOptions;
  hasExtension?: boolean;
  timeout?: number;
};
