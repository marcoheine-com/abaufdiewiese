import {Suspense} from 'react';
import type {V2_MetaFunction} from '@shopify/remix-oxygen';
import {defer, redirect, type LoaderArgs} from '@shopify/remix-oxygen';
import type {FetcherWithComponents} from '@remix-run/react';
import {Await, Link, useLoaderData} from '@remix-run/react';
import type {
  ProductFragment,
  ProductVariantsQuery,
  ProductVariantFragment,
} from 'storefrontapi.generated';

import {
  Image,
  Money,
  VariantSelector,
  type VariantOption,
  getSelectedProductOptions,
  CartForm,
} from '@shopify/hydrogen';
import type {
  AttributeInput,
  CartLineInput,
} from '@shopify/hydrogen/storefront-api-types';
import {formatGermanDate, getVariantUrl} from '~/utils';
import {PrimaryButton} from '~/components/PrimaryButton';
import {useState} from 'react';

export const meta: V2_MetaFunction = ({data}) => {
  return [{title: `Hydrogen | ${data.product.title}`}];
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
  return defer({product, variants});
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
  const {product, variants} = useLoaderData<typeof loader>();
  const {selectedVariant} = product;
  return (
    <div className="product">
      <ProductImage image={selectedVariant?.image} />
      <ProductMain
        selectedVariant={selectedVariant}
        product={product}
        variants={variants}
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
}: {
  product: ProductFragment;
  selectedVariant: ProductFragment['selectedVariant'];
  variants: Promise<ProductVariantsQuery>;
}) {
  const {title, descriptionHtml} = product;
  return (
    <div className="product-main">
      <h1>{title}</h1>
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
}: {
  product: ProductFragment;
  selectedVariant: ProductFragment['selectedVariant'];
  variants: Array<ProductVariantFragment>;
}) {
  const [guests, setGuests] = useState<AttributeInput>({
    key: 'guests',
    value: '1 - 2',
  });
  const [menu, setMenu] = useState<AttributeInput>({
    key: 'menu',
    value: 'Klassisch',
  });

  const onChangeHandler = (key: 'guests' | 'menu', value: string) => {
    if (key === 'guests') {
      setGuests({key, value});
    }

    if (key === 'menu') {
      setMenu({key, value});
    }
  };

  const attributes = [guests, menu].filter(Boolean) as AttributeInput[];

  const buttonLabel = selectedVariant?.availableForSale
    ? 'Mein Picknick buchen'
    : 'Leider ausverkauft';

  return (
    <div className="flex flex-col gap-6">
      <div className="grid md:grid-cols-[120px_auto]">
        <legend className="font-normal">Picknickgäste</legend>
        <fieldset className="flex flex-wrap gap-4 md:flex-nowrap">
          <input
            type="radio"
            name="guests"
            value="1 - 2"
            id="1-2"
            required
            checked={guests?.value === '1 - 2'}
            onChange={() => onChangeHandler('guests', '1 - 2')}
          />
          <label htmlFor="1-2" className="md:flex-1 text-center">
            1 -2
          </label>
          <input
            type="radio"
            name="guests"
            value="3 - 4"
            id="3-4"
            checked={guests?.value === '3 - 4'}
            onChange={() => onChangeHandler('guests', '3 - 4')}
          />
          <label htmlFor="3-4" className="md:flex-1 text-center">
            3 - 4
          </label>
          <input
            type="radio"
            name="guests"
            value="5 - 6"
            id="5-6"
            checked={guests?.value === '5 - 6'}
            onChange={() => onChangeHandler('guests', '5 - 6')}
          />
          <label htmlFor="5-6" className="md:flex-1 text-center">
            5 - 6
          </label>
        </fieldset>
      </div>
      <div className="grid md:grid-cols-[120px_auto]">
        <legend className="font-normal">Picknickmenü</legend>
        <fieldset className="flex flex-wrap md:flex-nowrap gap-4">
          <input
            type="radio"
            name="menu"
            value="Klassisch"
            id="klassisch"
            required
            checked={menu?.value === 'Klassisch'}
            onChange={() => onChangeHandler('menu', 'Klassisch')}
          />
          <label htmlFor="klassisch" className="md:flex-1 text-center">
            Klassisch
          </label>
          <input
            type="radio"
            name="menu"
            value="Vegetarisch"
            id="vegetarisch"
            checked={menu?.value === 'Vegetarisch'}
            onChange={() => onChangeHandler('menu', 'Vegetarisch')}
          />
          <label htmlFor="vegetarisch" className="md:flex-1 text-center">
            Vegetarisch
          </label>
          <input
            type="radio"
            name="menu"
            value="Vegan"
            id="vegan"
            checked={menu?.value === 'Vegan'}
            onChange={() => onChangeHandler('menu', 'Vegan')}
          />
          <label htmlFor="vegan" className="md:flex-1 text-center">
            Vegan
          </label>
        </fieldset>
      </div>
      <VariantSelector
        handle={product.handle}
        options={product.options}
        variants={variants}
      >
        {({option}) => <ProductOptions key={option.name} option={option} />}
      </VariantSelector>
      <AddToCartButton
        disabled={!selectedVariant || !selectedVariant.availableForSale}
        onClick={() => {
          window.location.href = window.location.href + '#cart-aside';
        }}
        lines={
          selectedVariant
            ? [
                {
                  merchandiseId: selectedVariant.id,
                  quantity: 1,
                  attributes: attributes,
                },
              ]
            : []
        }
      >
        {buttonLabel}
      </AddToCartButton>
    </div>
  );
}

function ProductOptions({option}: {option: VariantOption}) {
  return (
    <div className="md:grid md:grid-cols-[120px_auto]" key={option.name}>
      <h5 className="mt-0">{option.name}</h5>
      <div className="flex items-start flex-wrap gap-4">
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
  onClick,
}: {
  analytics?: unknown;
  children: React.ReactNode;
  disabled?: boolean;
  lines: CartLineInput[];
  onClick?: () => void;
}) {
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
            onClick={onClick}
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
