import type {V2_MetaFunction} from '@shopify/remix-oxygen';
import {defer, type LoaderArgs} from '@shopify/remix-oxygen';
import {Await, useLoaderData, Link} from '@remix-run/react';
import {Suspense} from 'react';
import {Image} from '@shopify/hydrogen';
import type {LatestProductCollectionQuery} from 'storefrontapi.generated';
import {PrimaryButton} from '~/components/PrimaryButton';
import {formatGermanDate, notFound} from '~/utils';
import {HOME_PAGE_QUERY} from '~/queries/sanity/home';
import Hero from '~/components/Hero';
import {SanityHomePage} from '~/lib/sanity';
import {PRODUCT_COLLECTION_QUERY} from '~/queries/shopify/collection';
import PortableText from '~/components/PortableText';

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

  if (!page) {
    throw notFound();
  }

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
      {page?.modules?.map((module) => {
        switch (module._type) {
          case 'module.features':
            return (
              <section
                className="content-padding content-margin-top content-max-width grid gap-8 md:gap-16 lg:gap-32 xl:gap-64 grid-cols-2 md:grid-cols-4"
                key={module._key}
              >
                {module?.feature?.map((feature) => {
                  return (
                    <div
                      key={feature._key}
                      className="flex flex-col items-center"
                    >
                      <Image
                        data={feature.icon}
                        aspectRatio="1/1"
                        sizes="(min-width: 45em) 20vw, 50vw"
                      />
                      <h3 className="uppercase max-w-[100px] text-center">
                        {feature.title}
                      </h3>
                    </div>
                  );
                })}
              </section>
            );
          case 'module.textmedia':
            return (
              <section
                className="content-max-width grid sm:grid-cols-2 content-margin-top"
                key={module._key}
              >
                <Image
                  data={module.media}
                  aspectRatio="1/1"
                  className="object-cover"
                  sizes="(min-width: 45em) 20vw, 50vw"
                />

                {module.text && (
                  <div className="content-padding py-8 bg-primaryVariant flex flex-col justify-center items-center">
                    <PortableText value={module.text} />
                  </div>
                )}
              </section>
            );

          case 'module.showProducts':
            return (
              <RecommendedProducts
                latestProductsCollection={data?.latestProductsCollection}
                key={module._key}
              />
            );
          default:
            return null;
        }
      })}
    </div>
  );
}

function RecommendedProducts({
  latestProductsCollection,
}: {
  latestProductsCollection: Promise<LatestProductCollectionQuery>;
}) {
  return (
    <div className="w-full content-max-width content-padding content-margin-top">
      <h2 className="text-center mt-8">Aktuelle Picknicks</h2>
      <Suspense fallback={<div>Loading...</div>}>
        <Await resolve={latestProductsCollection}>
          {({collection}) => {
            return (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 mt-8 gap-8 content-padding content-max-width">
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
