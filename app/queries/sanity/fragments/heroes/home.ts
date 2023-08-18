import groq from 'groq';
import {IMAGE} from '~/queries/sanity/fragments/image';

export const HERO_HOME = groq`
  title,
  subTitle,
  heroImage {
    ${IMAGE}
  },
`;
