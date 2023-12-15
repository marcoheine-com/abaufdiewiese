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
  modules?: SanityHomePageModules[];
  seo: SanitySeo;
};

export type SanityHomePageModules =
  | SanityModuleFeatures
  | SanityModuleTextmedia
  | SanityShowProducts
  | SanityShowContactform
  | SanityModuleSupport;

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
  showProducts: boolean;
};

export type SanityShowContactform = {
  _key: string;
  _type: 'module.showContactform';
  showContactform: boolean;
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

export type SanityModuleAccordion = {
  _key?: string;
  _type: 'module.accordion';
  groups: {
    _key: string;
    _type: 'group';
    body: PortableTextBlock[];
    title: string;
  }[];
};

export type SanityPage = {
  body: PortableTextBlock[];
  hero?: SanityHero;
  showTitle: boolean;
  modules?: (
    | SanityModuleAccordion
    | SanityShowContactform
    | SanityModuleTextmedia
  )[];
  slug: {
    current: string;
  };
  seo: SanitySeo;
  title: string;
};

export type SanityProductPage = {
  _id: string;
  available: boolean;
  body: PortableTextBlock[];
  menuHeadline: string;
  menus: SanityProductMenuItem[];
  allergens: PortableTextBlock[];
  gid: string;
  slug?: string;
  seo: SanitySeo;
};

export type SanityProductMenuItem = {
  _key: string;
  _type: 'product.menuItem';
  title: string;
  description: PortableTextBlock[];
  image: SanityAssetImage;
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

export type SanitySettings = {
  footer: {
    links: SanityMenuLink[];
    socialLinks: SanitySocialLink[];
  };
  menuLinks: SanityMenuLink[];
  contactForm: SanityContactform;
};

export type SanityContactform = {
  title: string;
  subtitle: string;
  text: PortableTextBlock[];
  image: SanityAssetImage;
};
