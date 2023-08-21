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
