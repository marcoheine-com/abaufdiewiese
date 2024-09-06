import groq from 'groq';

import {COLOR_THEME} from './fragments/colorTheme';
import {LINKS} from './fragments/links';
import {LINK_SOCIAL} from '~/queries/sanity/fragments/linkSocial';
import {IMAGE} from '~/queries/sanity/fragments/image';
import {PORTABLE_TEXT} from '~/queries/sanity/fragments/portableText/portableText';

export const LAYOUT_QUERY = groq`
  *[_type == 'settings'] | order(_updatedAt desc) [0] {
    seo,
    "menuLinks": menu.links[] {
      ${LINKS}
    },
    footer {
      socialLinks[] {
        ${LINK_SOCIAL}
      },
      links[] {
        ${LINKS}
      },
    },
    contactForm {
      title,
      subtitle,
      image {
        ${IMAGE}
      },
      text[]{
        ${PORTABLE_TEXT}
      },
    },
    notFoundPage {
      body,
      "collectionGid": collection->store.gid,
      colorTheme->{
        ${COLOR_THEME}
      },
      title
    },
    newsletter {
      title,
      image {
        ${IMAGE}
      },
      text[]{
        ${PORTABLE_TEXT}
      },
    },
  }
`;
