import type {V2_MetaFunction} from '@shopify/remix-oxygen';
import {json, type LoaderArgs} from '@shopify/remix-oxygen';
import {Link, useLoaderData, useMatches} from '@remix-run/react';
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

export async function loader({request, params, context}: LoaderArgs) {
  const {handle} = params;

  if (!params.handle) {
    throw new Error('Missing page handle');
  }

  const cache = context.storefront.CacheLong();

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

  return json({
    page,
    collection: handle === 'unsere-picknicks' ? collection : null,
  });
}

export default function Page() {
  const {page, collection} = useLoaderData<typeof loader>();
  const [root] = useMatches();
  const layout = root.data?.layout;

  const [date, setDate] = useState<Date | null>(null);

  const renderProducts =
    page.slug.current === 'unsere-picknicks' && collection !== null;

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
          default:
            return null;
        }
      })}

      {renderProducts && (
        <>
          <section className="content-padding content-max-width content-margin-top flex justify-end items-center gap-2">
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
              Für dieses Datum sind leider keine Picknicks verfügbar. Probiere
              es einfach mit einem anderen Datum.
            </p>
          )}
        </>
      )}
    </div>
  );
}
