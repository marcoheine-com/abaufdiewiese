import type {V2_MetaFunction} from '@shopify/remix-oxygen';
import {json, type LoaderArgs} from '@shopify/remix-oxygen';
import {Await, Link, useLoaderData} from '@remix-run/react';
import {PAGE_QUERY} from '~/queries/sanity/page';
import {Suspense} from 'react';
import {getPaginationVariables, Image} from '@shopify/hydrogen';
import {PrimaryButton} from '~/components/PrimaryButton';
import {formatGermanDate, notFound} from '~/utils';
import {PRODUCT_COLLECTION_QUERY} from '~/queries/shopify/collection';

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

  const page = await context.sanity.query<any>({
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

  const renderProducts =
    page.slug.current === 'unsere-picknicks' && collection !== null;

  return (
    <div className="">
      <header className="content-padding content-max-width">
        <h1>{page.title}</h1>
      </header>
      {renderProducts && (
        <>
          {/* TODO: remove suspense because we're already awaiting */}
          <Suspense fallback={<div>Loading...</div>}>
            <Await resolve={collection}>
              {({collection}) => {
                return (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-8 content-padding content-max-width">
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

                        <PrimaryButton className="mt-4">
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
        </>
      )}
    </div>
  );
}
