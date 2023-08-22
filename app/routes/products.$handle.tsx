import {ChangeEvent, Suspense} from 'react';
import type {V2_MetaFunction} from '@shopify/remix-oxygen';
import {defer, redirect, type LoaderArgs} from '@shopify/remix-oxygen';
import type {FetcherWithComponents} from '@remix-run/react';
import {Await, Link, useLoaderData} from '@remix-run/react';
import type {
  ProductFragment,
  ProductVariantsQuery,
  ProductVariantFragment,
  LatestProductFragment,
} from 'storefrontapi.generated';

import {
  Image,
  Money,
  VariantSelector,
  type VariantOption,
  getSelectedProductOptions,
  CartForm,
} from '@shopify/hydrogen';
import type {CartLineInput} from '@shopify/hydrogen/storefront-api-types';
import {formatGermanDate, getVariantUrl} from '~/utils';
import {PrimaryButton} from '~/components/PrimaryButton';
import {useState} from 'react';
import {PRODUCT_COLLECTION_QUERY} from '~/queries/shopify/collection';

export const meta: V2_MetaFunction = ({data}) => {
  return [{title: `${data.product.title}`}];
};

export async function loader({params, request, context}: LoaderArgs) {
  const {handle} = params;
  const {storefront} = context;

  const selectedOptions = getSelectedProductOptions(request).filter(
    (option) =>
      // Filter out Shopify predictive search query params
      !option.name.startsWith('_sid') &&
      !option.name.startsWith('_pos') &&
      !option.name.startsWith('_psq') &&
      !option.name.startsWith('_ss') &&
      !option.name.startsWith('_v'),
  );

  if (!handle) {
    throw new Error('Expected product handle to be defined');
  }

  // await the query for the critical product data
  const {product} = await storefront.query(PRODUCT_QUERY, {
    variables: {handle, selectedOptions},
  });

  const {collection} = await storefront.query(PRODUCT_COLLECTION_QUERY, {
    variables: {
      handle: 'picknick-besonderheiten',
      first: 3,
    },
  });

  // In order to show which variants are available in the UI, we need to query
  // all of them. But there might be a *lot*, so instead separate the variants
  // into it's own separate query that is deferred. So there's a brief moment
  // where variant options might show as available when they're not, but after
  // this deffered query resolves, the UI will update.
  const variants = storefront.query(VARIANTS_QUERY, {
    variables: {handle},
  });

  if (!product?.id) {
    throw new Response(null, {status: 404});
  }

  const firstVariant = product.variants.nodes[0];
  const firstVariantIsDefault = Boolean(
    firstVariant.selectedOptions.find(
      (option) => option.name === 'Title' && option.value === 'Default Title',
    ),
  );

  if (firstVariantIsDefault) {
    product.selectedVariant = firstVariant;
  } else {
    // if no selected variant was returned from the selected options,
    // we redirect to the first variant's url with it's selected options applied
    if (!product.selectedVariant) {
      return redirectToFirstVariant({product, request});
    }
  }
  return defer({product, variants, collection});
}

function redirectToFirstVariant({
  product,
  request,
}: {
  product: ProductFragment;
  request: Request;
}) {
  const url = new URL(request.url);
  const firstVariant = product.variants.nodes[0];

  throw redirect(
    getVariantUrl({
      pathname: url.pathname,
      handle: product.handle,
      selectedOptions: firstVariant.selectedOptions,
      searchParams: new URLSearchParams(url.search),
    }),
    {
      status: 302,
    },
  );
}

export default function Product() {
  const {product, variants, collection} = useLoaderData<typeof loader>();
  const {selectedVariant} = product;
  return (
    <div className="grid md:grid-cols-2 gap-16 w-full content-padding content-max-width mt-10 md:mt-24">
      <ProductImage image={selectedVariant?.image} />
      <ProductMain
        selectedVariant={selectedVariant}
        product={product}
        variants={variants}
        addOns={collection?.products.nodes || []}
      />
    </div>
  );
}

function ProductImage({image}: {image: ProductVariantFragment['image']}) {
  if (!image) {
    return <div className="product-image" />;
  }
  return (
    <div className="product-image">
      <Image
        alt={image.altText || 'Product Image'}
        aspectRatio="1/1"
        data={image}
        key={image.id}
        sizes="(min-width: 45em) 50vw, 100vw"
      />
    </div>
  );
}

function ProductMain({
  selectedVariant,
  product,
  variants,
  addOns,
}: {
  product: ProductFragment;
  selectedVariant: ProductFragment['selectedVariant'];
  variants: Promise<ProductVariantsQuery>;
  addOns: LatestProductFragment[];
}) {
  const {title, descriptionHtml} = product;
  return (
    <div className="product-main">
      <h2>{title}</h2>
      <p className="grid grid-cols-2 ">
        {product.date?.value && (
          <time dateTime={product.date?.value}>
            {formatGermanDate(product.date?.value)}
          </time>
        )}
        {product.date?.value && (
          <time dateTime={product.date?.value}>{product.timeRange?.value}</time>
        )}
        {product.location?.value && (
          <span className="mt-4">{product.location?.value}</span>
        )}
      </p>
      <br />
      <ProductPrice selectedVariant={selectedVariant} />
      <br />
      <div dangerouslySetInnerHTML={{__html: descriptionHtml}} />
      <br />
      <Suspense
        fallback={
          <ProductForm
            product={product}
            selectedVariant={selectedVariant}
            variants={[]}
          />
        }
      >
        <Await
          errorElement="There was a problem loading product variants"
          resolve={variants}
        >
          {(data) => (
            <ProductForm
              product={product}
              selectedVariant={selectedVariant}
              variants={data.product?.variants.nodes || []}
              addOns={addOns}
            />
          )}
        </Await>
      </Suspense>
    </div>
  );
}

function ProductPrice({
  selectedVariant,
}: {
  selectedVariant: ProductFragment['selectedVariant'];
}) {
  return (
    <div className="product-price">
      {selectedVariant?.compareAtPrice ? (
        <>
          <p>Sale</p>
          <br />
          <div className="product-price-on-sale">
            {selectedVariant ? <Money data={selectedVariant.price} /> : null}
            <s>
              <Money data={selectedVariant.compareAtPrice} />
            </s>
          </div>
        </>
      ) : (
        selectedVariant?.price && <Money data={selectedVariant?.price} />
      )}
    </div>
  );
}

function ProductForm({
  product,
  selectedVariant,
  variants,
  addOns,
}: {
  product: ProductFragment;
  selectedVariant: ProductFragment['selectedVariant'];
  variants: Array<ProductVariantFragment>;
  addOns?: LatestProductFragment[];
}) {
  const [addOnsForCart, setAddOnsForCart] = useState<LatestProductFragment[]>();

  const buttonLabel = selectedVariant?.availableForSale
    ? 'Mein Picknick buchen'
    : 'Leider ausverkauft';

  const linesToAdd = selectedVariant
    ? [
        {
          merchandiseId: selectedVariant.id,
          quantity: 1,
        },
      ]
    : [];

  const linesWithAddOns = addOnsForCart?.map((addOn) => ({
    merchandiseId: addOn.variants.edges[0].node.id,
    quantity: 1,
    attributes: [
      {
        key: 'Besonderheiten',
        value: `${addOn.title} für ${product?.title} am ${
          product?.date?.value && formatGermanDate(product.date?.value)
        }}`,
      },
    ],
  }));

  if (linesWithAddOns) {
    linesToAdd.push(...linesWithAddOns);
  }

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const addon = addOns?.find((item) => item.id === e.target.value);

    if (!addon) {
      return;
    }

    if (e.target.checked) {
      setAddOnsForCart((prev) => [...(prev || []), addon]);
    }

    if (!e.target.checked) {
      setAddOnsForCart((prev) =>
        prev?.filter((item) => item.id !== e.target.value),
      );
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <VariantSelector
        handle={product.handle}
        options={product.options}
        variants={variants}
      >
        {({option}) => {
          return <ProductOptions key={option.name} option={option} />;
        }}
      </VariantSelector>
      <div className="md:grid xl:grid-cols-[120px_auto] md:gap-1">
        <legend className="font-normal">Besonderheiten</legend>
        <fieldset className="flex flex-wrap gap-4 items-start mt-1 xl:mt-0">
          {addOns?.map((addOn) => (
            <div key={addOn.id} className="flex items-center">
              <input
                type="checkbox"
                id={addOn.id}
                name="addOns"
                value={addOn.id}
                onChange={(e) => handleCheckboxChange(e)}
              />
              <label className="ml-2" htmlFor={addOn.id}>
                {addOn.title}
              </label>
            </div>
          ))}
        </fieldset>
      </div>
      <AddToCartButton
        disabled={!selectedVariant || !selectedVariant.availableForSale}
        lines={linesToAdd}
      >
        {buttonLabel}
      </AddToCartButton>
    </div>
  );
}

function ProductOptions({option}: {option: VariantOption}) {
  return (
    <div className="md:grid xl:grid-cols-[120px_auto]" key={option.name}>
      <h5 className="mt-0">{option.name}</h5>
      <div className="mt-1 flex items-start flex-wrap gap-4 xl:mt-0">
        {option.values.map(({value, isAvailable, isActive, to}) => {
          return (
            <Link
              className={` ${
                isActive
                  ? 'border-2 border-primary m-0'
                  : 'border-[1px] border-radioBorder'
              }
             hover:no-underline cursor-pointer rounded py-2 px-8 m-[1px] md:flex-1 text-center
            `}
              key={option.name + value}
              prefetch="intent"
              preventScrollReset
              replace
              to={to}
              style={{
                opacity: isAvailable ? 1 : 0.3,
              }}
            >
              {value}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function AddToCartButton({
  analytics,
  children,
  disabled,
  lines,
}: {
  analytics?: unknown;
  children: React.ReactNode;
  disabled?: boolean;
  lines: CartLineInput[];
}) {
  const handleOnClick = () => {
    window.location.href = window.location.href + '#cart-aside';
  };
  return (
    <CartForm route="/cart" inputs={{lines}} action={CartForm.ACTIONS.LinesAdd}>
      {(fetcher: FetcherWithComponents<any>) => (
        <>
          <input
            name="analytics"
            type="hidden"
            value={JSON.stringify(analytics)}
          />
          <PrimaryButton
            type="submit"
            onClick={handleOnClick}
            disabled={disabled ?? fetcher.state !== 'idle'}
          >
            {children}
          </PrimaryButton>
        </>
      )}
    </CartForm>
  );
}

const PRODUCT_VARIANT_FRAGMENT = `#graphql
  fragment ProductVariant on ProductVariant {
    availableForSale
    compareAtPrice {
      amount
      currencyCode
    }
    id
    image {
      __typename
      id
      url
      altText
      width
      height
    }
    price {
      amount
      currencyCode
    }
    product {
      title
      handle
    }
    quantityAvailable
    selectedOptions {
      name
      value
    }
    sku
    title
    unitPrice {
      amount
      currencyCode
    }
  }
` as const;

const PRODUCT_FRAGMENT = `#graphql
  fragment Product on Product {
    id
    title
    vendor
    handle
    descriptionHtml
    description
    timeRange: metafield(namespace: "custom", key: "time_range") {
      value
    }
    date:  metafield(namespace: "custom", key: "date") {
      value
    }
    location: metafield(namespace: "custom", key: "location") {
      value
    }
    media(first: 4) {
      nodes {
        ... on MediaImage {
          mediaContentType
          image {
            id
            url
            altText
            width
            height
          }
        }
        ... on Model3d {
          id
          mediaContentType
          sources {
            mimeType
            url
          }
        }
      }
    }
    options {
      name
      values
    }
    selectedVariant: variantBySelectedOptions(selectedOptions: $selectedOptions) {
      ...ProductVariant
    }
    variants(first: 1) {
      nodes {
        ...ProductVariant
      }
    }
    seo {
      description
      title
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
` as const;

const PRODUCT_QUERY = `#graphql
  query Product(
    $country: CountryCode
    $handle: String!
    $language: LanguageCode
    $selectedOptions: [SelectedOptionInput!]!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...Product
    }
  }
  ${PRODUCT_FRAGMENT}
` as const;

const PRODUCT_VARIANTS_FRAGMENT = `#graphql
  fragment ProductVariants on Product {
    variants(first: 250) {
      nodes {
        ...ProductVariant
      }
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
` as const;

const VARIANTS_QUERY = `#graphql
  ${PRODUCT_VARIANTS_FRAGMENT}
  query ProductVariants(
    $country: CountryCode
    $language: LanguageCode
    $handle: String!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...ProductVariants
    }
  }
` as const;
