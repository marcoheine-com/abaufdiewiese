import {useForm} from '@formspree/react';
import {Image} from '@shopify/hydrogen';
import {PrimaryButton} from '~/components/PrimaryButton';
import PortableText from '~/components/portableText/PortableText';
import {SanityContactform} from '~/lib/sanity';

interface Props {
  content: SanityContactform;
}
export default function Contactform({content}: Props) {
  const [state, handleSubmit] = useForm('xyyqwqoz');

  return (
    <section className="content-max-width content-padding content-margin-top">
      <h2 className="text-center uppercase">{content.title}</h2>
      <p className="text-center uppercase">{content.subtitle}</p>

      <section className="grid lg:grid-cols-2 gap-8 mt-8">
        <section className="bg-primaryVariant py-8 px-8 md:px-32 gap-8 flex flex-col items-center">
          <Image
            data={content.image}
            sizes="(min-width: 45em) 50vw, 100vw"
            className="object-cover rounded-full"
            aspectRatio="1/1"
          />

          <PortableText value={content.text} />
        </section>

        <form method="post" onSubmit={handleSubmit}>
          <fieldset className="flex flex-col gap-8 md:grid md:grid-cols-[auto_auto] md:auto-rows-min">
            <div className="flex flex-col md:col-span-1">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                name="name"
                id="name"
                placeholder="Wie ist dein Nachname?"
                required
              />
            </div>
            <div className="flex flex-col md:col-start-2 md:col-span-1">
              <label htmlFor="surname">Vorname</label>
              <input
                type="text"
                name="surname"
                id="surname"
                placeholder="Wie ist dein Vorname?"
                required
              />
            </div>
            <div className="flex flex-col md:col-start-1 md:col-span-2">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="Unter welcher Email bist du erreichbar?"
                required
              />
            </div>

            <div className="flex flex-col md:col-span-2">
              <label htmlFor="message">Message</label>
              <textarea
                name="message"
                id="message"
                placeholder="Was möchtest du uns mitteilen?"
                required
              />
            </div>
            <PrimaryButton
              type="submit"
              className="md:col-start-1 md:col-span-1 md:self-start"
            >
              {state.submitting
                ? 'Nachricht wird gesendet...'
                : 'Nachricht absenden'}
            </PrimaryButton>
          </fieldset>
          {state.succeeded ? (
            <p className="mt-8 font-normal text-center">
              Vielen Dank für deine Nachricht!
            </p>
          ) : null}
        </form>
      </section>
    </section>
  );
}
