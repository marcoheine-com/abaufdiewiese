export const PRODUCT_VARIANT_FIELDS = `
  fragment ProductVariantFields on ProductVariant {
    availableForSale
    compareAtPrice {
      currencyCode
      amount
    }
    id
    image {
      altText
      height
      id
      url
      width
    }
    price {
      currencyCode
      amount
    }
    selectedOptions {
      name
      value
    }
    title
    sku
    unitPrice {
      amount
      currencyCode
    }
    product {
      title
      handle
    }
  }
`;

export const PRODUCT_ITEM_FRAGMENT = `#graphql
fragment MoneyProductItem on MoneyV2 {
  amount
  currencyCode
}
fragment ProductItem on Product {
  id
  handle
  title
  featuredImage {
    id
    altText
    url
    width
    height
  }
  metafield(namespace: "custom", key: "date") {
    value
    type
  }
  priceRange {
    minVariantPrice {
      ...MoneyProductItem
    }
    maxVariantPrice {
      ...MoneyProductItem
    }
  }
  variants(first: 5) {
    nodes {
      selectedOptions {
        name
        value
      }
    }
  }
}
` as const;

export const LATEST_PRODUCT = `#graphql
fragment LatestProduct on Product {
  id
  title
  handle
  description
  variants(first: 1) {
    edges {
      node {
        id
      }
    }
  }
  priceRange {
    minVariantPrice {
      amount
      currencyCode
    }
  }
  images(first: 1) {
    nodes {
      id
      url
      altText
      width
      height
    }
  }
  metafield(namespace: "custom", key: "date") {
    value
    type
  }
}
` as const;

export const PRODUCT_FIELDS = `
  fragment ProductFields on Product {
    handle
    id
    options {
      name
      values
    }
    title
    vendor
  }
`;

export const PRODUCTS_AND_COLLECTIONS = `#graphql
  ${PRODUCT_FIELDS}
  ${PRODUCT_VARIANT_FIELDS}

  query productsAndCollections(
    $country: CountryCode
    $language: LanguageCode
    $ids: [ID!]!
  ) @inContext(country: $country, language: $language) {
    productsAndCollections: nodes(ids: $ids) {
      ... on Product {
        ...ProductFields
        variants(first: 250) {
          nodes {
            ...ProductVariantFields
          }
        }
      }
      ... on Collection {
        id
        title
        description
        handle
      }
    }
  }
`;
