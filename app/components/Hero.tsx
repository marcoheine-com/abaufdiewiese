import {Image} from '@shopify/hydrogen';
import {SanityHero} from '~/lib/sanity';

type Props = {
  hero: SanityHero;
};

export default function Hero({hero}: Props) {
  return (
    <section className="relative content-max-width">
      <Image
        className="w-full max-h-[700px]"
        data={hero.heroImage}
        sizes="(min-width: 1024px) 1024px, 100vw"
      />
      <section className="content-padding content-max-width absolute top-0 left-0 bg-backgroundVariant opacity-[70%] h-full flex flex-col justify-center lg:w-2/4 lg:left-20 lg:p-16">
        {hero.title && <h1>{hero.title}</h1>}
        {hero.subTitle && (
          <h2 className="mt-4 font-normal md:text-[48px]">{hero.subTitle}</h2>
        )}
      </section>
    </section>
  );
}
