import {Link} from '@remix-run/react';
import {Image, Money} from '@shopify/hydrogen';
import {PrimaryButton} from './PrimaryButton';
import {LatestProductCollectionQuery} from 'storefrontapi.generated';

interface Props {
  homeCollection: LatestProductCollectionQuery;
}

export default function HomeProducts({homeCollection}: Props) {
  return (
    <section className="content-padding content-margin-top content-max-width">
      <h2 className="text-center mt-8">{homeCollection.collection?.title}</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-8 xl:gap-16">
        {homeCollection?.collection?.products?.nodes?.map((product) => {
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
              <h4 className="uppercase text-center mt-4">{product.title}</h4>
              <Money data={product.priceRange.minVariantPrice} />

              <PrimaryButton className="mt-4">Jetzt kaufen</PrimaryButton>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
