import groq from 'groq';
import {PORTABLE_TEXT} from '../portableText/portableText';
import {SEO_SHOPIFY} from '../seoShopify';
import {IMAGE} from '~/queries/sanity/fragments/image';

export const PRODUCT_PAGE = groq`
  _id,
  "available": !store.isDeleted && store.status == 'active',
  body[]{
    ${PORTABLE_TEXT}
  },
  menuHeadline,
  menus[] {
    _key,
    title,
    description[]{
      ${PORTABLE_TEXT}
    },
    image {
      ${IMAGE}
    },
  },
  allergens[]{
    ${PORTABLE_TEXT}
  },
  "gid": store.gid,
  ${SEO_SHOPIFY},
  "slug": store.slug.current,
`;
