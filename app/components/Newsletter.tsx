import {Image} from '@shopify/hydrogen';
import {SanityNewsletter} from '~/lib/sanity';
import PortableText from './portableText/PortableText';
import {PrimaryButton} from './PrimaryButton';
import {Form, Link, useNavigation} from '@remix-run/react';

interface Props {
  content: SanityNewsletter;
}

export default function Newsletter({content}: Props) {
  const navigation = useNavigation();
  return (
    <section className="content-max-width content-padding content-margin-top grid gap-4">
      <h2 className="uppercase">{content.title}</h2>

      {content.image ? (
        <Image
          data={content.image}
          sizes="(min-width: 45em) 50vw, 100vw"
          className="object-cover rounded-full"
          aspectRatio="1/1"
        />
      ) : null}

      <PortableText value={content.text} className="max-w-[1080px]" />

      <Form method="post" action="/newsletter" className="flex flex-col gap-8">
        <label className="flex flex-col">
          Email*
          <input
            type="email"
            name="email"
            id="email"
            placeholder="max@mustermann.de"
            required
            autoComplete="on"
            className="placeholder-gray-400 font-thin md:w-1/2"
          />
        </label>
        <label className="flex flex-col">
          Dein Name*
          <input
            type="text"
            name="name"
            id="name"
            placeholder="Max Mustermann"
            required
            autoComplete="on"
            className="placeholder-gray-400 font-thin md:w-1/2"
            pattern="[\p{L} ]+"
          />
        </label>
        <label className="hidden" aria-hidden>
          <input
            type="checkbox"
            name="dont_fill_this_out_if_you_are_human"
            tabIndex={-1}
            autoComplete="off"
            className="hidden"
            value="1"
          />
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" name="privacy" required />
          <span>
            Ich habe die{' '}
            <Link
              to="/datenschutzerklaerung"
              target="_blank"
              className="underline"
            >
              Datenschutzerklärung
            </Link>{' '}
            gelesen und bin damit einverstanden.
          </span>
        </label>
        <PrimaryButton type="submit" className="md:w-auto md:self-start">
          {navigation.state === 'submitting'
            ? 'Wird abgeschickt...'
            : 'Abschicken'}
        </PrimaryButton>
      </Form>
    </section>
  );
}
