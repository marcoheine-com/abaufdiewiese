import type {Image, PortableTextBlock} from '@sanity/types';

export interface SanityAssetImage extends Image {
  _type: 'image';
  altText?: string;
  blurDataURL: string;
  height: number;
  url: string;
  width: number;
}

export type SanityLink = SanityLinkExternal | SanityLinkInternal;

export type SanityLinkExternal = {
  _key: string;
  _type: 'linkExternal';
  newWindow?: boolean;
  url: string;
  title: string;
};

export type SanityLinkInternal = {
  _key: string;
  _type: 'linkInternal';
  documentType: string;
  slug?: string;
  title: string;
};

export type SanityMenuLink = SanityLinkInternal;
// | SanityLinkExternal;
// | SanityCollectionGroup

export type SanityCollectionGroup = {
  _key: string;
  _type: 'collectionGroup';
  collectionLinks?: SanityCollection[];
  collectionProducts?: SanityCollection;
  title: string;
};

export type SanityHomePage = {
  hero?: SanityHero;
  // modules: (SanityModuleImage | SanityModuleInstagram)[];
  seo: SanitySeo;
};

export type SanityCollection = {
  _id: string;
  gid: string;
  hero?: SanityHero;
  slug?: string;
  title: string;
  vector?: string;
};

export type SanityHero = {
  title?: string;
  subTitle?: string;
  heroImage?: SanityAssetImage;
};

export type SanitySeo = {
  description?: string;
  image?: SanityAssetImage;
  title: string;
};
