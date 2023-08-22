import groq from 'groq';
import {IMAGE} from '~/queries/sanity/fragments/image';

export const LINK_SOCIAL = groq`
  _key,
  _type,
  url,
  icon {
    ${IMAGE} 
  },
  newWindow,
`;
