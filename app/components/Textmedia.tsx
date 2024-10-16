import {PortableText} from '@portabletext/react';
import {Image} from '@shopify/hydrogen';
import {SanityModuleTextmedia} from '~/lib/sanity';

interface Props {
  data: SanityModuleTextmedia;
}

export default function Textmedia({data}: Props) {
  const {media, text} = data;
  return (
    <section className="content-max-width grid lg:grid-cols-2 content-margin-top">
      <Image
        data={media}
        aspectRatio="1/1"
        className="object-cover md:max-h-[480px]"
        sizes="(min-width: 45em) 20vw, 50vw"
      />

      {text && (
        <div className="content-padding py-8 bg-primaryVariant flex flex-col justify-center items-center">
          <PortableText value={text} />
        </div>
      )}
    </section>
  );
}
