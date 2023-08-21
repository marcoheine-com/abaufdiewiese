import {useLocation} from '@remix-run/react';
import type {
  Product,
  ProductVariant,
  SelectedOption,
} from '@shopify/hydrogen/storefront-api-types';
import {AppLoadContext} from '@shopify/remix-oxygen';
import {useMemo} from 'react';
import {SanityHomePage, SanityPage, SanityProductPage} from '~/lib/sanity';
import {extract} from '@sanity/mutator';
import {PRODUCTS_AND_COLLECTIONS} from '~/queries/shopify/product';

export function useVariantUrl(
  handle: string,
  selectedOptions: SelectedOption[],
) {
  const {pathname} = useLocation();

  return useMemo(() => {
    return getVariantUrl({
      handle,
      pathname,
      searchParams: new URLSearchParams(),
      selectedOptions,
    });
  }, [handle, selectedOptions, pathname]);
}

export function getVariantUrl({
  handle,
  pathname,
  searchParams,
  selectedOptions,
}: {
  handle: string;
  pathname: string;
  searchParams: URLSearchParams;
  selectedOptions: SelectedOption[];
}) {
  const match = /(\/[a-zA-Z]{2}-[a-zA-Z]{2}\/)/g.exec(pathname);
  const isLocalePathname = match && match.length > 0;

  const path = isLocalePathname
    ? `${match![0]}products/${handle}`
    : `/products/${handle}`;

  selectedOptions.forEach((option) => {
    searchParams.set(option.name, option.value);
  });

  const searchString = searchParams.toString();

  return path + (searchString ? '?' + searchParams.toString() : '');
}

export function formatGermanDate(date: string) {
  const [year, month, day] = date.split('-');
  return `${day}.${month}.${year}`;
}

export const notFound = (message = 'Not Found') =>
  new Response(message, {
    status: 404,
    statusText: 'Not Found',
  });

type StorefrontPayload = {
  productsAndCollections: Product[];
};

/**
 * Get data from Shopify for page components
 */
export async function fetchGids({
  page,
  context,
}: {
  page: SanityHomePage | SanityPage | SanityProductPage;
  context: AppLoadContext;
}) {
  const productGids = extract(`..[_type == "productWithVariant"].gid`, page);

  const {productsAndCollections} =
    await context.storefront.query<StorefrontPayload>(
      PRODUCTS_AND_COLLECTIONS,
      {
        variables: {
          ids: [...productGids],
        },
      },
    );

  return extract(`..[id?]`, productsAndCollections) as (
    | Product
    | ProductVariant
  )[];
}
