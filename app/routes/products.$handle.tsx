import {ChangeEvent, Suspense} from 'react';
import type {V2_MetaFunction} from '@shopify/remix-oxygen';
import {defer, redirect, type LoaderArgs} from '@shopify/remix-oxygen';
import type {FetcherWithComponents} from '@remix-run/react';
import {Await, Link, NavLink, useLoaderData} from '@remix-run/react';
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
import {SanityProductPage} from '~/lib/sanity';
import {PRODUCT_PAGE_QUERY} from '~/queries/sanity/product';
import PortableText from '~/components/PortableText';

export const meta: V2_MetaFunction = ({data}) => {
  return [
    {
      title: `${data.product?.title}`,
    },
    {
      name: 'description',
      content: `${data?.product?.description}`,
    },
    {
      property: 'og:image',
      content: `${data?.product?.selectedVariant?.image?.url}`,
    },
    {
      property: 'og:image:alt',
      content: `${data?.product?.selectedVariant?.image?.alt}`,
    },
    {
      property: 'og:title',
      content: `${data?.product?.title}`,
    },
    {
      property: 'og:description',
      content: `${data?.product?.description}`,
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
      href: `https://abaufdiewiese.de/${data.sanityProduct?.slug}`,
    },
  ];
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

  if (!params.handle) {
    throw new Error('Missing page handle');
  }

  const cache = context.storefront.CacheLong();

  const sanityProduct = await context.sanity.query<SanityProductPage>({
    query: PRODUCT_PAGE_QUERY,
    params: {
      slug: params.handle,
    },
    cache,
  });

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
  return defer({product, variants, collection, sanityProduct});
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
  const {product, variants, collection, sanityProduct} =
    useLoaderData<typeof loader>();
  const {selectedVariant} = product;

  return (
    <section className="w-full mt-10 md:mt-24">
      <div className="grid lg:grid-cols-2 gap-16 w-full content-padding content-max-width">
        <ProductImage image={selectedVariant?.image} />
        <ProductMain
          selectedVariant={selectedVariant}
          product={product}
          variants={variants}
          addOns={collection?.products.nodes || []}
        />
      </div>
      {sanityProduct?.menus ? (
        <section className="content-margin-top content-max-width">
          <h3 className="font-normal content-padding uppercase">
            {sanityProduct.menuHeadline}
          </h3>
          <section className="bg-primaryVariant mt-4">
            <section className="grid md:grid-cols-2 lg:grid-cols-3 content-padding content-max-width gap-4">
              {sanityProduct.menus?.map((item) => (
                <article
                  className="flex flex-col my-8 lg:my-16 bg-white p-4 md:px-8"
                  key={item._key}
                >
                  <h4 className="font-normal">{item.title}</h4>
                  {item.description && (
                    <PortableText value={item.description} />
                  )}
                  <Image
                    data={item.image}
                    sizes="(min-width: 45em) 20vw, 50vw"
                    className="max-h-[376px] object-cover mt-4"
                  />
                </article>
              ))}
            </section>
          </section>
        </section>
      ) : null}
      <section className="content-margin-top content-padding content-max-width">
        <h3 className="font-normal uppercase">Nichts für dich dabei?</h3>
        <p>
          Das kriegen wir schon hin! Melde dich gerne direkt bei uns unter
          <a href="mailto:info@abaufdiewiese.de"> info@abaufdiewiese.de</a> oder
          über unser{' '}
          <NavLink to="/kontakt" prefetch="intent">
            Kontaktformular
          </NavLink>
          .
        </p>
        <NavLink
          to="/unsere-picknicks"
          className="self-center text-center mt-8 flex gap-2 border-0"
          prefetch="intent"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 448 512"
            height={24}
            width={24}
            fill="#FFEC9B"
          >
            <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z" />
          </svg>
          <span className="border-b-2 border-b-primaryVariant">
            Zurück zu den anderen Picknickterminen
          </span>
        </NavLink>
      </section>
    </section>
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
    <div className="product-main flex flex-col gap-4">
      <h2>{title}</h2>
      <p className="grid grid-cols-2">
        {product.date?.value && (
          <time dateTime={product.date?.value}>
            {formatGermanDate(product.date?.value)}
          </time>
        )}
        {product.date?.value && (
          <time dateTime={product.date?.value}>{product.timeRange?.value}</time>
        )}
      </p>
      {product.location?.value && (
        <p className="flex gap-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height={24}
            viewBox="0 0 384 512"
            width={24}
          >
            <path d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z" />
          </svg>
          <span>{product.location?.value}</span>
        </p>
      )}

      <ProductPrice selectedVariant={selectedVariant} />

      <div dangerouslySetInnerHTML={{__html: descriptionHtml}} />

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
    <div className="product-price font-normal">
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
    <div className="flex flex-col gap-6 mt-4">
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
        <legend className="font-normal font-quattrocentosans">
          Besonderheiten
        </legend>
        <fieldset className="flex flex-wrap gap-4 items-start mt-1 xl:mt-0 ">
          {addOns?.map((addOn) => (
            <div key={addOn.id} className="flex items-center">
              <input
                type="checkbox"
                id={addOn.id}
                name="addOns"
                value={addOn.id}
                onChange={(e) => handleCheckboxChange(e)}
              />
              <label className="ml-2 font-thin" htmlFor={addOn.id}>
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
      <h5 className="mt-0 font-normal">{option.name}</h5>
      <div className="mt-1 flex items-start flex-wrap gap-4 xl:mt-0">
        {option.values.map(({value, isAvailable, isActive, to}) => {
          return (
            <Link
              className={` ${
                isActive
                  ? 'border-2 border-primary m-0 font-normal'
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
            className="flex justify-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 576 512"
              width={24}
              height={24}
            >
              <path d="M0 24C0 10.7 10.7 0 24 0H69.5c22 0 41.5 12.8 50.6 32h411c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3H170.7l5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5H488c13.3 0 24 10.7 24 24s-10.7 24-24 24H199.7c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5H24C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z" />
            </svg>
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
