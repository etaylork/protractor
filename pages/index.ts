// page exports
export * from './other';
export * from './forecasting';
export * from './home/report';
export * from './support';
export * from './study';

// support exports
export * from '../utils';

// object exports
import { SelectorPage } from './other/selector/selector.page';

export let selectorPage: SelectorPage = new SelectorPage();