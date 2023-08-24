import groq from 'groq';

import {MARK_DEFS} from '../portableText/markDefs';
import {IMAGE} from '~/queries/sanity/fragments/image';

export const MODULE_ACCORDION = groq`
  groups[] {
    _key,
    body[] {
      ...,
      (_type == 'image') => {
        ${IMAGE}
      },
      markDefs[] {
        ${MARK_DEFS}
      }
    },
    title,
  }
`;
