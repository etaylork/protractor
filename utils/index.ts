export { run, waitClick, waitClickable, waitVisible, waitText, status, ElementStatus } from './utils';
export { $, browser, by, element, element as ele, ElementFinder, ElementFinder as EF, ElementArrayFinder as EAF,
    ElementArrayFinder, ExpectedConditions, Key } from 'protractor';
export { logger } from './logger';
export { Page } from '../pages/page.page';
export { Validation as v } from '../pages/other/validation/validation.page';
export { expect } from 'chai';
export { UserRole } from './user.role';
export { TableDefinition } from 'cucumber';
export { parseMetaData, trimFilterColumn, strToNumArray } from './text';
export { Err, Msg, Str} from './glossary';
export { Filter } from './support'

export const utils = require('../utils/utils');

import { Sidebar } from '../pages/other/sidebar/sidebar.page';
import { API } from './api';
import { EF, EAF } from '.'

export const sidebar: Sidebar =  new Sidebar();
export const api: API = new API();

export type EFNumFunc = (num?: number) => EF;
export type EFStrFunc = (str?: string) => EF;
export type EAFNumFunc = (num?: number) => EAF;
export type EAFStrFunc = (num?: number) => EAF;
