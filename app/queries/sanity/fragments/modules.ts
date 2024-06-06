import groq from 'groq';
import {MODULE_ACCORDION} from '~/queries/sanity/fragments/modules/accordion';

import {MODULE_FEATURES} from '~/queries/sanity/fragments/modules/features';
import {MODULE_SHOW_CONTACTFORM} from '~/queries/sanity/fragments/modules/showContactform';
import {MODULE_SHOW_ALL_PRODUCTS} from '~/queries/sanity/fragments/modules/showAllProducts';
import {MODULE_SUPPORT} from '~/queries/sanity/fragments/modules/support';
import {MODULE_TEXTMEDIA} from '~/queries/sanity/fragments/modules/textmedia';
import { MODULE_SHOW_LATEST_PRODUCTS } from './modules/showLatestProducts';
import { MODULE_GRID } from './modules/grid';

export const MODULES = groq`
  _key,
  _type,
  (_type == "module.features") => {
    ${MODULE_FEATURES}
  },
  (_type == "module.accordion") => {
    ${MODULE_ACCORDION}
  },
  (_type == "module.textmedia") => {
    ${MODULE_TEXTMEDIA}
  },
  (_type == "module.grid") => {
    ${MODULE_GRID}
  },
  (_type == "module.showAllProducts") => {
    ${MODULE_SHOW_ALL_PRODUCTS}
  },
  (_type == "module.showLatestProducts") => {
    ${MODULE_SHOW_LATEST_PRODUCTS}
  },
  (_type == "module.showContactform") => {
    ${MODULE_SHOW_CONTACTFORM}
  },
  (_type == "module.support") => {
    ${MODULE_SUPPORT}
  },
`;
