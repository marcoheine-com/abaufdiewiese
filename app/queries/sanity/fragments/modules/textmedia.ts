import groq from 'groq';
import {IMAGE} from '~/queries/sanity/fragments/image';

export const MODULE_TEXTMEDIA = groq`
text[]{
  ...,
  markDefs[]{
    ...,
    _type == "internalLink" => {
      "slug": @.reference->slug
    }
  }
},
  media {
    ${IMAGE}
  },
`;
