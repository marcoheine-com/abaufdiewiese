import type {ActionArgs, V2_MetaFunction} from '@shopify/remix-oxygen';
import {defer, type LoaderArgs} from '@shopify/remix-oxygen';
import {
  Await,
  useLoaderData,
  Link,
  NavLink,
  useMatches,
} from '@remix-run/react';
import {Suspense} from 'react';
import {Image} from '@shopify/hydrogen';
import type {LatestProductCollectionQuery} from 'storefrontapi.generated';
import {PrimaryButton} from '~/components/PrimaryButton';
import {formatGermanDate, notFound} from '~/utils';
import {HOME_PAGE_QUERY} from '~/queries/sanity/home';
import Hero from '~/components/Hero';
import {SanityHomePage} from '~/lib/sanity';
import {PRODUCT_COLLECTION_QUERY} from '~/queries/shopify/collection';
import PortableText from '~/components/portableText/PortableText';
import Contactform from '~/components/Contactform';

export const meta: V2_MetaFunction = ({data}) => {
  return [
    {
      title: `${data.page?.seo?.title}`,
    },
    {
      name: 'description',
      content: `${data?.page?.seo?.description}`,
    },
    {
      property: 'og:image',
      content: `${data?.page?.seo?.image?.url}`,
    },
    {
      property: 'og:image:alt',
      content: `${data?.page?.seo?.image?.alt}`,
    },
    {
      property: 'og:title',
      content: `${data.page?.seo?.title}`,
    },
    {
      property: 'og:description',
      content: `${data?.page?.seo?.description}`,
    },
    {
      property: 'og:type',
      content: 'website',
    },
    {
      property: 'og:url',
      content: 'https://abaufdiewiese.de',
    },
    {
      tagName: 'link',
      rel: 'canonical',
      href: 'https://abaufdiewiese.de',
    },
  ];
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

  const [root] = useMatches();

  const layout = root.data?.layout;

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
                      <h4 className="uppercase text-[16px] max-w-[100px] text-center">
                        {feature.title}
                      </h4>
                    </div>
                  );
                })}
              </section>
            );
          case 'module.textmedia':
            return (
              <section
                className="content-max-width grid lg:grid-cols-2 content-margin-top"
                key={module._key}
              >
                <Image
                  data={module.media}
                  aspectRatio="1/1"
                  className="object-cover md:max-h-[480px]"
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
            if (!module.showProducts) {
              return null;
            }

            return (
              <RecommendedProducts
                latestProductsCollection={data?.latestProductsCollection}
                key={module._key}
              />
            );
          case 'module.showContactform':
            if (!module.showContactform) {
              return null;
            }

            return (
              <Contactform key={module._key} content={layout?.contactForm} />
            );

          case 'module.support':
            return (
              <section
                className="content-max-width content-margin-top content-padding flex items-center flex-col"
                key={module._key}
              >
                <h2>{module.title}</h2>

                {module.text && (
                  <p className="max-w-2xl text-center mt-4">{module.text}</p>
                )}
                <div className="grid items-center sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {module?.supportItems?.map((support) => (
                    <Image
                      key={support._key}
                      data={support.image}
                      sizes="(min-width: 45em) 20vw, 50vw"
                    />
                  ))}
                </div>
              </section>
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
    <div className="w-full content-max-width content-padding content-margin-top flex flex-col">
      <h2 className="text-center mt-8">Aktuelle Picknicks</h2>
      <Suspense fallback={<div>Loading...</div>}>
        <Await resolve={latestProductsCollection}>
          {({collection}) => {
            return (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 mt-8 xl:gap-16 gap-8">
                {collection?.products?.nodes?.map((product) => {
                  const firstSentence = product.description.split('.')[0];
                  return (
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
                      <p className="text-center">{firstSentence}</p>

                      <PrimaryButton className="mt-4">
                        {product.metafield?.value
                          ? `Picknick am ${formatGermanDate(
                              product.metafield?.value,
                            )} buchen`
                          : 'Picknick buchen'}
                      </PrimaryButton>
                    </Link>
                  );
                })}
              </div>
            );
          }}
        </Await>
      </Suspense>
      <NavLink
        to="/unsere-picknicks"
        className="self-center text-center mt-8 flex gap-2 border-0"
        prefetch="intent"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 448 512"
          fill="#FFEC9B"
          width={24}
          height={24}
        >
          <path d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z" />
        </svg>
        <span className="border-b-2 border-b-primaryVariant">
          Zeige mir alle Picknicktermine
        </span>
      </NavLink>
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
