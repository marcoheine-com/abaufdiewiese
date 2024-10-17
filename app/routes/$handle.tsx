import type {V2_MetaFunction} from '@shopify/remix-oxygen';
import {json, type LoaderArgs} from '@shopify/remix-oxygen';
import {Link, NavLink, useLoaderData, useMatches} from '@remix-run/react';
import {PAGE_QUERY} from '~/queries/sanity/page';
import {getPaginationVariables, Image} from '@shopify/hydrogen';
import {PrimaryButton} from '~/components/PrimaryButton';
import {formatGermanDate, notFound} from '~/utils';
import {PRODUCT_COLLECTION_QUERY} from '~/queries/shopify/collection';
import {SanityPage} from '~/lib/sanity';
import Hero from '~/components/Hero';
import {useState} from 'react';
import PortableText from '~/components/portableText/PortableText';
import AccordionBlock from '~/components/portableText/blocks/Accordion';
import Contactform from '~/components/Contactform';
import Grid from '~/components/Grid';
import * as React from 'react';
import Textmedia from '~/components/Textmedia';
import HomeProducts from '~/components/HomeProducts';

export const meta: V2_MetaFunction = ({data}) => {
  return [
    {
      title: `${data.page?.seo?.title}`,
    },
    {
      description: `${data?.page?.seo?.description}`,
    },
    {
      property: 'og:image',
      content: `${data?.page?.seo?.image?.url}`,
    },
    {
      property: 'og:image:alt',
      content: `${data?.page?.seo?.image?.altText}`,
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
      href: `https://abaufdiewiese.de/${data.page?.slug?.current}`,
    },
  ];
};

export async function loader({request, params, context}: LoaderArgs) {
  const {handle} = params;

  if (!params.handle) {
    throw new Error('Missing page handle');
  }

  const cache = context.storefront.CacheCustom({
    mode: 'public',
    maxAge: 60,
    staleWhileRevalidate: 60,
  });

  const page = await context.sanity.query<SanityPage>({
    query: PAGE_QUERY,
    params: {
      slug: handle,
    },
    cache,
  });

  if (!page) {
    throw notFound();
  }

  const {storefront} = context;

  const paginationVariables = getPaginationVariables(request, {
    pageBy: 8,
  });

  const collection = await storefront.query(PRODUCT_COLLECTION_QUERY, {
    variables: {
      handle: 'alle-picknicktermine',
      ...paginationVariables,
    },
  });

  const homeCollection = await storefront.query(PRODUCT_COLLECTION_QUERY, {
    variables: {
      handle: 'fur-zuhause',
      ...paginationVariables,
    },
  });

  return json({
    page,
    collection,
    homeCollection,
  });
}

export default function Page() {
  const {page, collection, homeCollection} = useLoaderData<typeof loader>();
  const [root] = useMatches();
  const layout = root.data?.layout;

  const [date, setDate] = useState<Date | null>(null);

  const products = date
    ? collection?.collection?.products.nodes.filter((product) => {
        if (!date) {
          return true;
        }

        const productDate = new Date(
          product.metafield?.value as string,
        ).toUTCString();

        return productDate === date.toUTCString();
      })
    : collection?.collection?.products.nodes;

  return (
    <div className="w-full">
      {page?.hero && <Hero hero={page.hero} />}

      {page.showTitle && (
        <h1 className="content-padding content-max-width content-margin-top">
          {page.title}
        </h1>
      )}

      {page?.body && (
        <PortableText
          className="content-max-width content-padding content-margin-top"
          value={page.body}
        />
      )}

      {page?.modules?.map((module) => {
        switch (module._type) {
          case 'module.accordion':
            return (
              <AccordionBlock
                className="content-max-width content-padding content-margin-top"
                key={module._key}
                value={module}
              />
            );
          case 'module.showContactform':
            if (!module.showContactform) {
              return null;
            }

            return (
              <Contactform key={module._key} content={layout?.contactForm} />
            );

          case 'module.showLatestProducts':
            if (!module.showLatestProducts) {
              return null;
            }

            return (
              <div
                className="w-full content-max-width content-padding content-margin-top flex flex-col"
                key={module._key}
              >
                <h2 className="text-center mt-8">Aktuelle Picknicks</h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:gap-16 gap-8 mt-8">
                  {collection?.collection?.products?.nodes
                    .slice(0, 3)
                    .map((product) => {
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

                          <PrimaryButton className="mt-4 w-full">
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
              </div>
            );
          case 'module.showAllProducts':
            if (!module.showAllProducts) {
              return null;
            }

            return (
              <React.Fragment key={module._key}>
                <section
                  className="content-padding content-max-width content-margin-top flex justify-end items-center gap-2"
                  key={module._key}
                >
                  <label htmlFor="date">Nach Datum filtern:</label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    placeholder="Datum auswählen"
                    onChange={(e) => {
                      if (!e.target.value) {
                        setDate(null);
                        return;
                      }

                      setDate(new Date(e.target.value));
                    }}
                  />
                </section>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-8 xl:gap-16 content-padding content-max-width">
                  {products
                    ?.filter((product) => {
                      if (!date) {
                        return true;
                      }

                      const productDate = new Date(
                        product.metafield?.value as string,
                      ).toUTCString();

                      return productDate === date.toUTCString();
                    })
                    .map((product) => {
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
                          <p className="text-center">{`${firstSentence}.`}</p>

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
                {products?.length === 0 && (
                  <p className="text-center content-padding">
                    Für dieses Datum sind leider keine Picknicks verfügbar.
                    Probiere es einfach mit einem anderen Datum.
                  </p>
                )}
              </React.Fragment>
            );
          case 'module.textmedia':
            return <Textmedia key={module._key} data={module} />;

          case 'module.grid':
            return <Grid key={module._key} grid={module} />;

          case 'module.showHomeProducts':
            if (!module.showHomeProducts) {
              return null;
            }

            return (
              <HomeProducts homeCollection={homeCollection} key={module._key} />
            );

          default:
            return null;
        }
      })}
    </div>
  );
}
