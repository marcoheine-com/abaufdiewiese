import type {V2_MetaFunction} from '@shopify/remix-oxygen';
import {defer, type LoaderArgs} from '@shopify/remix-oxygen';
import {Await, useLoaderData, Link} from '@remix-run/react';
import {Suspense} from 'react';
import {Image} from '@shopify/hydrogen';
import type {LatestProductCollectionQuery} from 'storefrontapi.generated';
import {PrimaryButton} from '~/components/PrimaryButton';
import {formatGermanDate} from '~/utils';
import {HOME_PAGE_QUERY} from '~/queries/sanity/home';
import Hero from '~/components/Hero';
import {SanityHomePage} from '~/lib/sanity';
import {PRODUCT_COLLECTION_QUERY} from '~/queries/shopify/collection';

export const meta: V2_MetaFunction = () => {
  return [{title: 'Hydrogen | Home'}];
};

export async function loader({params, context}: LoaderArgs) {
  const {storefront} = context;

  const collection = storefront.query(PRODUCT_COLLECTION_QUERY, {
    variables: {
      handle: 'alle-picknicktermine',
      first: 3,
    },
  });

  const cache = context.storefront.CacheCustom({
    mode: 'public',
    maxAge: 60,
    staleWhileRevalidate: 60,
  });

  const page = await context.sanity.query<SanityHomePage>({
    query: HOME_PAGE_QUERY,
    cache,
  });

  return defer({
    latestProductsCollection: collection,
    page,
  });
}

export default function Homepage() {
  const data = useLoaderData<typeof loader>();
  const {page} = data;
  return (
    <div className="home">
      {page?.hero && <Hero hero={page.hero} />}
      <h2 className="text-center mt-8">Aktuelle Picknicks</h2>
      <RecommendedProducts
        latestProductsCollection={data?.latestProductsCollection}
      />
    </div>
  );
}

function RecommendedProducts({
  latestProductsCollection,
}: {
  latestProductsCollection: Promise<LatestProductCollectionQuery>;
}) {
  return (
    <div className="w-full content-max-width content-padding mt-4">
      <Suspense fallback={<div>Loading...</div>}>
        <Await resolve={latestProductsCollection}>
          {({collection}) => {
            return (
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 content-padding content-max-width">
                {collection?.products.nodes.map((product) => (
                  <Link
                    key={product.id}
                    className="recommended-product"
                    to={`/products/${product.handle}`}
                  >
                    <Image
                      data={product.images.nodes[0]}
                      aspectRatio="1/1"
                      sizes="(min-width: 45em) 20vw, 50vw"
                    />
                    <h4 className="uppercase text-center mt-4">
                      {product.title}
                    </h4>
                    <p className="text-center">{product.description}</p>

                    <PrimaryButton>
                      {product.metafield?.value
                        ? `Picknick am ${formatGermanDate(
                            product.metafield?.value,
                          )} buchen`
                        : 'Picknick buchen'}
                    </PrimaryButton>
                  </Link>
                ))}
              </div>
            );
          }}
        </Await>
      </Suspense>
      <br />
    </div>
  );
}

export const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  fragment RecommendedProduct on Product {
    id
    title
    handle
    description
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
  query RecommendedProducts ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 3, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...RecommendedProduct
      }
    }
  }
` as const;
