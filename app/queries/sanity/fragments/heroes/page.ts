import groq from 'groq';

import {IMAGE} from '~/queries/sanity/fragments/image';

export const HERO_PAGE = groq`
  title,
  subTitle,
  heroImage {
    ${IMAGE}
  },
`;
