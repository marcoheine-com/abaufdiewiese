import groq from 'groq';

import {IMAGE} from '../image';

export const MODULE_FEATURES = groq`
  feature[] {
    _key,
    _type,
    title,
    icon {
      ${IMAGE}
    },
  }
`;
