import groq from 'groq';

import {HERO_PAGE} from '../heroes/page';
import {PORTABLE_TEXT} from '../portableText/portableText';
import {SEO} from '../seo';

export const PAGE = groq`
  slug,
  body[]{
    ${PORTABLE_TEXT}
  },
  (showHero == true) => {
    hero {
      ${HERO_PAGE}
    },
  },
  showTitle,
  ${SEO},
  title,
`;
