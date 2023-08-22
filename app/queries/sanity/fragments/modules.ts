import groq from 'groq';

import {MODULE_FEATURES} from '~/queries/sanity/fragments/modules/features';
import {MODULE_SHOW_PRODUCTS} from '~/queries/sanity/fragments/modules/showproducts';
import {MODULE_SUPPORT} from '~/queries/sanity/fragments/modules/support';
import {MODULE_TEXTMEDIA} from '~/queries/sanity/fragments/modules/textmedia';

export const MODULES = groq`
  _key,
  _type,
  (_type == "module.features") => {
    ${MODULE_FEATURES}
  },
  (_type == "module.textmedia") => {
    ${MODULE_TEXTMEDIA}
  },
  (_type == "module.showProducs") => {
    ${MODULE_SHOW_PRODUCTS}
  },
  (_type == "module.support") => {
    ${MODULE_SUPPORT}
  },
`;
