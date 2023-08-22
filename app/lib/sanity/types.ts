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
  modules?: (
    | SanityModuleFeatures
    | SanityModuleTextmedia
    | SanityShowProducts
    | SanityModuleSupport
  )[];
  seo: SanitySeo;
};

export type SanityModuleFeatures = {
  _key: string;
  _type: 'module.features';
  title: string;
  feature: SanityFeature[];
};

export type SanityFeature = {
  _key: string;
  _type: 'feature';
  title: string;
  icon?: SanityAssetImage;
};

export type SanityShowProducts = {
  _key: string;
  _type: 'module.showProducts';
  title: string;
};

export type SanityModuleTextmedia = {
  _key: string;
  _type: 'module.textmedia';
  media?: SanityAssetImage;
  text?: PortableTextBlock[];
};

export type SanityModuleSupport = {
  _key: string;
  _type: 'module.support';
  title: string;
  text?: string;
  supportItems?: SanitySupportItem[];
};

export type SanitySupportItem = {
  _key: string;
  _type: 'support';
  image?: SanityAssetImage;
};

export type SanityPage = {
  body: PortableTextBlock[];
  hero?: SanityHero;
  seo: SanitySeo;
  title: string;
};

export type SanityProductPage = {
  _id: string;
  available: boolean;
  body: PortableTextBlock[];
  gid: string;
  slug?: string;
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

export type SanitySocialLink = {
  _key: string;
  _type: 'socialLinks';
  icon?: SanityAssetImage;
  url: string;
  newWindow?: boolean;
};
