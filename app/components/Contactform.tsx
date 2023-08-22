import {useForm} from '@formspree/react';
import {PrimaryButton} from '~/components/PrimaryButton';

export default function Contactform() {
  const [state, handleSubmit] = useForm('xjvqwrbk');

  return (
    <section className="content-max-width content-padding content-margin-top">
      <h2 className="text-center uppercase">Melde dich bei mir!</h2>
      <p className="text-center uppercase">
        Du kannst mich telefonisch oder per Mail erreichen
      </p>

      <section className="grid lg:grid-cols-2 gap-8 mt-8">
        <section className="bg-primaryVariant py-8 px-8 xl:px-52 flex flex-col items-center">
          <img
            src="/images/Katharina_Madeira.webp"
            alt="abaufdiewiese"
            className="rounded-full object-cover aspect-square"
          />
          <p className="uppercase mt-8">Katharina Jäger</p>
          <dl className="flex gap-1 flex-col mt-2">
            <div className="flex gap-1">
              <dt>Mobil</dt>
              <dd>
                <a href="tel:+4915735988888">+49 1573 5988888</a>
              </dd>
            </div>
            <div className="flex gap-1">
              <dt>Email</dt>
              <dd>
                <a href="mailto:info@abaufdiewiese.de">info@abaufdiewiese.de</a>
              </dd>
            </div>
          </dl>
        </section>

        {state.succeeded ? <p>Vielen Dank für deine Nachricht!</p> : null}
        <form
          method="post"
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 md:grid md:grid-cols-[auto_auto]"
        >
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
              // required
            />
          </div>
          <div className="flex flex-col md:col-start-1 md:col-span-1">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Unter welcher Email bist du erreichbar?"
              // required
            />
          </div>

          <div className="flex flex-col md:col-span-2">
            <label htmlFor="message">Message</label>
            <textarea
              name="message"
              id="message"
              placeholder="Was möchtest du uns mitteilen?"
              // required
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
        </form>
      </section>
    </section>
  );
}
