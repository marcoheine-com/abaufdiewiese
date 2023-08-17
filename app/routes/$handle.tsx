import type {V2_MetaFunction} from '@shopify/remix-oxygen';
import {json, type LoaderArgs} from '@shopify/remix-oxygen';
import {Await, Link, useLoaderData} from '@remix-run/react';
import {PAGE_QUERY} from '~/queries/sanity/page';
import {RECOMMENDED_PRODUCTS_QUERY} from '~/routes/_index';
import {Suspense} from 'react';
import {Image} from '@shopify/hydrogen';
import {PrimaryButton} from '~/components/PrimaryButton';
import {formatGermanDate} from '~/utils';

export const meta: V2_MetaFunction = ({data}) => {
  return [
    {
      title: `${data.page.seo.title}`,
      description: `${data.page.seo.description}`,
    },
  ];
};

export async function loader({params, context}: LoaderArgs) {
  const cache = context.storefront.CacheLong();

  const page = await context.sanity.query<any>({
    query: PAGE_QUERY,
    params: {
      slug: params.handle,
    },
    cache,
  });

  const {storefront} = context;

  const products = await storefront.query(RECOMMENDED_PRODUCTS_QUERY);

  return json({
    page,
    products: params.handle === 'unsere-picknicks' ? products : null,
  });
}

export default function Page() {
  const {page, products} = useLoaderData<typeof loader>();

  const renderProducts =
    page.slug.current === 'unsere-picknicks' && products !== null;

  return (
    <div className="">
      <header className="content-padding content-max-width">
        <h1>{page.title}</h1>
      </header>
      {renderProducts && (
        <>
          <Suspense fallback={<div>Loading...</div>}>
            <Await resolve={products}>
              {({products}) => {
                return (
                  <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 content-padding content-max-width">
                    {products.nodes.map((product) => (
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
        </>
      )}
    </div>
  );
}
