import {PRODUCT_ITEM_FRAGMENT, LATEST_PRODUCT} from '~/queries/shopify/product';

export const COLLECTION_QUERY = `#graphql
${PRODUCT_ITEM_FRAGMENT}
query Collection(
  $handle: String!
  $country: CountryCode
  $language: LanguageCode
  $first: Int
  $last: Int
  $startCursor: String
  $endCursor: String
) @inContext(country: $country, language: $language) {
  collection(handle: $handle) {
    id
    handle
    title
    description
    products(
      first: $first,
      last: $last,
      before: $startCursor,
      after: $endCursor
    ) {
      nodes {
        ...ProductItem
      }
      pageInfo {
        hasPreviousPage
        hasNextPage
        hasNextPage
        endCursor
      }
    }
  }
}
` as const;

export const PRODUCT_COLLECTION_QUERY = `#graphql
${LATEST_PRODUCT}
query LatestProductCollection(
  $handle: String!
  $country: CountryCode
  $language: LanguageCode
  $first: Int
  $last: Int
  $startCursor: String
  $endCursor: String
) @inContext(country: $country, language: $language) {
  collection(handle: $handle) {
    id
    handle
    title
    description
    products(
      first: $first,
      last: $last,
      before: $startCursor,
      after: $endCursor
    ) {
      nodes {
        ...LatestProduct
      }
      pageInfo {
        hasPreviousPage
        hasNextPage
        hasNextPage
        endCursor
      }
    }
  }
}
` as const;
