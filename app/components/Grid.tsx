import {SanityModuleGrid} from '~/lib/sanity';
import PortableText from './portableText/PortableText';
import {Image} from '@shopify/hydrogen';

type Props = {
  grid: SanityModuleGrid;
};
export default function Grid({grid}: Props) {
  return (
    <section className="content-padding content-margin-top content-max-width grid md:grid-cols-2 gap-12">
      {grid.items?.map((item) => (
        <article
          key={item._key}
          className={`flex ${
            !item.imageAtTop ? 'flex-col-reverse' : 'flex-col'
          }`}
        >
          <Image
            data={item.image}
            className={`object-cover`}
            aspectRatio="16/9"
          />
          <div
            key={item._key}
            className="bg-[#FBF7E7] p-8 lg:pt-16 lg:px-16 lg:pb-12 h-full flex gap-4 flex-col"
          >
            <h2>{item.title}</h2>
            <PortableText value={item.body} />
          </div>
        </article>
      ))}
    </section>
  );
}
