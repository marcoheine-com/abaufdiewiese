import groq from 'groq';

import {IMAGE} from '../image';

export const MODULE_SUPPORT = groq`
  title,
  text,
  supportItems[] {
    _key,
    _type,
    image {
      ${IMAGE}
    },
  }
`;
