// Rich text annotations used in the block content editor
import annotationLinkEmail from './annotations/linkEmail'
import annotationLinkExternal from './annotations/linkExternal'
import annotationLinkInternal from './annotations/linkInternal'
import annotationLinkPhone from './annotations/linkPhone'
import annotationProduct from './annotations/product'

const annotations = [
  annotationLinkEmail,
  annotationLinkExternal,
  annotationLinkInternal,
  annotationLinkPhone,
  annotationProduct,
]

// Document types
import collection from './documents/collection'
import page from './documents/page'
import product from './documents/product'
import productVariant from './documents/productVariant'

const documents = [collection, page, product, productVariant]

// Singleton document types
import home from './singletons/home'
import settings from './singletons/settings'

const singletons = [home, settings]

// Block content
import body from './blocks/body'

const blocks = [body]

// Object types
import customProductOptionColor from './objects/customProductOption/color'
import customProductOptionColorObject from './objects/customProductOption/colorObject'
import customProductOptionSize from './objects/customProductOption/size'
import customProductOptionSizeObject from './objects/customProductOption/sizeObject'
import contactForm from './objects/global/contactForm'
import footer from './objects/global/footer'
import newsletter from './objects/global/newsletter'
import imageWithProductHotspots from './objects/hotspot/imageWithProductHotspots'
import inventory from './objects/shopify/inventory'
import linkExternal from './objects/global/linkExternal'
import linkInternal from './objects/global/linkInternal'
import linkSocial from './objects/global/linkSocial'
import links from './objects/global/links'
import notFoundPage from './objects/global/notFoundPage'
import heroCollection from './objects/hero/collection'
import heroHome from './objects/hero/home'
import heroPage from './objects/hero/page'
import moduleAccordion from './objects/module/accordion'
import accordionBody from './objects/module/accordionBody'
import accordionGroup from './objects/module/accordionGroup'
import moduleCallout from './objects/module/callout'
import moduleCallToAction from './objects/module/callToAction'
import moduleCollection from './objects/module/collection'
import moduleGrid from './objects/module/grid'
import gridItems from './objects/module/gridItem'
import menu from './objects/global/menu'
import moduleFeature from './objects/module/feature'
import moduleFeatures from './objects/module/features'
import moduleImage from './objects/module/image'
import moduleImageAction from './objects/module/imageCallToAction'
import moduleImages from './objects/module/images'
import moduleInstagram from './objects/module/instagram'
import moduleShowNewsLetter from './objects/module/showNewsletter'
import moduleProduct from './objects/module/product'
import moduleProducts from './objects/module/products'
import moduleTextmedia from './objects/module/textmedia'
import moduleShowAllProducts from './objects/module/showAllProducts'
import moduleShowLatestProducts from './objects/module/showLatestProducts'
import moduleShowHomeProducts from './objects/module/showHomeProducts'
import moduleShowContactform from './objects/module/showContactform'
import moduleSupport from './objects/module/support'
import moduleSupportItem from './objects/module/supportItem'
import placeholderString from './objects/shopify/placeholderString'
import priceRange from './objects/shopify/priceRange'
import productMenuitem from './objects/product/menuItem'
import spot from './objects/hotspot/spot'
import productHotspots from './objects/hotspot/productHotspots'
import option from './objects/shopify/option'
import productWithVariant from './objects/shopify/productWithVariant'
import proxyString from './objects/shopify/proxyString'
import seo from './objects/seo/seo'
import seoHome from './objects/seo/home'
import seoPage from './objects/seo/page'
import seoDescription from './objects/seo/description'
import seoShopify from './objects/seo/shopify'
import shopifyCollection from './objects/shopify/shopifyCollection'
import shopifyCollectionRule from './objects/shopify/shopifyCollectionRule'
import shopifyProduct from './objects/shopify/shopifyProduct'
import shopifyProductVariant from './objects/shopify/shopifyProductVariant'

// Collections
import collectionGroup from './objects/collection/group'
import collectionLinks from './objects/collection/links'

const objects = [
  customProductOptionColor,
  customProductOptionColorObject,
  customProductOptionSize,
  customProductOptionSizeObject,
  contactForm,
  footer,
  newsletter,
  imageWithProductHotspots,
  inventory,
  links,
  linkExternal,
  linkInternal,
  linkSocial,
  notFoundPage,
  heroCollection,
  heroHome,
  heroPage,
  moduleAccordion,
  accordionBody,
  accordionGroup,
  menu,
  moduleCallout,
  moduleCallToAction,
  moduleCollection,
  moduleGrid,
  gridItems,
  moduleFeature,
  moduleFeatures,
  moduleImage,
  moduleImageAction,
  moduleImages,
  moduleInstagram,
  moduleShowNewsLetter,
  moduleProduct,
  moduleProducts,
  moduleTextmedia,
  moduleShowAllProducts,
  moduleShowLatestProducts,
  moduleShowHomeProducts,
  moduleShowContactform,
  moduleSupport,
  moduleSupportItem,
  placeholderString,
  priceRange,
  spot,
  productHotspots,
  option,
  productMenuitem,
  productWithVariant,
  proxyString,
  seo,
  seoHome,
  seoPage,
  seoDescription,
  seoShopify,
  shopifyCollection,
  shopifyCollectionRule,
  shopifyProduct,
  shopifyProductVariant,
  collectionGroup,
  collectionLinks,
]

export const schemaTypes = [...annotations, ...singletons, ...objects, ...blocks, ...documents]
