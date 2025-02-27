import {useActionData, useLoaderData, useMatches} from '@remix-run/react';
import {ActionArgs, json, LoaderArgs} from '@shopify/remix-oxygen';
import Newsletter from '~/components/Newsletter';

export async function action({request, context}: ActionArgs) {
  const apiKey = context.env.BREVO_NEWSLETTER_API_KEY;
  const formData = await request.formData();
  const email = String(formData.get('email'));
  const name = String(formData.get('name'));
  const honeypot = String(formData.get('dont_fill_this_out_if_you_are_human'));

  if (honeypot && honeypot === '1') {
    return json({success: false});
  }

  try {
    const createContactResponse = await fetch(
      'https://api.brevo.com/v3/contacts',
      {
        method: 'POST',
        headers: {
          'api-key': apiKey,
          'Content-Type': 'application/json',
          accept: 'application/json',
        },
        body: JSON.stringify({
          updateEnabled: true,
          listIds: [5],
          email,
          attributes: {
            FIRSTNAME: name,
          },
        }),
      },
    );

    if (createContactResponse.status === 204) {
      return json({contactAlreadyExists: 'User already exists'});
    }

    if (!createContactResponse.ok) {
      throw new Error('Could not create contact');
    }

    const {id} = (await createContactResponse.json()) as {id: string};

    const sendMailResponse = await fetch(
      'https://api.brevo.com/v3/smtp/email',
      {
        method: 'POST',
        headers: {
          'api-key': apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          templateId: 1,
          to: [
            {
              email,
            },
          ],
          subject: 'Bitte bestätige deine Anmeldung zum Newsletter',
          params: {
            FIRSTNAME: name,
            USER_ID: id,
            EMAIL: email,
          },
        }),
      },
    );

    if (!sendMailResponse.ok) {
      throw new Error('Could not send mail');
    }

    return json({email});
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function loader({request, context}: LoaderArgs) {
  const apiKey = context.env.BREVO_NEWSLETTER_API_KEY;
  const url = new URL(request.url);
  const subscribeUser = url.searchParams.get('subscribe');
  const unsubscribeUser = url.searchParams.get('unsubscribe');

  const addUserToFinalList = async (user: string) => {
    try {
      const response = await fetch(
        'https://api.brevo.com/v3/contacts/lists/4/contacts/add',
        {
          method: 'POST',
          headers: {
            accept: 'application/json',
            'api-key': apiKey,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ids: [parseInt(user)],
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        // @ts-ignore
        throw new Error(`Could not subscribe user: ${data.message}`);
      }

      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const removeUserFromWaitingList = async (user: string) => {
    try {
      const response = await fetch(
        `https://api.brevo.com/v3/contacts/lists/5/contacts/remove`,
        {
          method: 'POST',
          headers: {
            accept: 'application/json',
            'api-key': apiKey,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ids: [parseInt(user)],
          }),
        },
      );

      if (!response.ok) {
        throw new Error(`Could not remove user from waiting list`);
      }

      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const deleteContact = async (user: string) => {
    try {
      const response = await fetch(
        `https://api.brevo.com/v3/contacts/${user}`,
        {
          method: 'DELETE',
          headers: {
            accept: 'application/json',
            'api-key': apiKey,
            'Content-Type': 'application/json',
          },
        },
      );

      if (!response.ok) {
        throw new Error(`Could not delete contact`);
      }

      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  if (subscribeUser) {
    const success = await addUserToFinalList(subscribeUser);
    if (success) {
      await removeUserFromWaitingList(subscribeUser);
      return json({success: true});
    }
  }

  if (unsubscribeUser) {
    const unsubscribe = await deleteContact(unsubscribeUser);
    return json({unsubscribe});
  }

  return json({success: false});
}

export default function Subscribe() {
  const actionData = useActionData();
  const loaderData = useLoaderData();
  const [root] = useMatches();

  const layout = root.data?.layout;

  if (loaderData.success === true) {
    return (
      <section className="content-max-width content-padding content-margin-top">
        <h1>Das hat geklappt! Deine Newsletter Anmeldung war erfolgreich!</h1>
      </section>
    );
  }

  if (loaderData.unsubscribe) {
    return (
      <section className="content-max-width content-padding content-margin-top">
        <h1>Deine Newsletter Abmeldung war erfolgreich!</h1>
      </section>
    );
  }

  if (actionData?.success === false) {
    return (
      <section className="content-max-width content-padding content-margin-top">
        <h1>Das hat leider nicht geklappt! Bitte versuche es erneut.</h1>
      </section>
    );
  }

  if (actionData?.contactAlreadyExists) {
    return (
      <section className="content-max-width content-padding content-margin-top">
        <h1>
          Es scheint als wärst du bereits angemeldet! Falls du meinen Newsletter
          nicht erhalten hast, prüfe bitte deinen Spam-Ordner.
        </h1>
      </section>
    );
  }

  if (!actionData) {
    return <Newsletter content={layout.newsletter} />;
  }

  return (
    <section className="content-max-width content-padding content-margin-top">
      <h1>Deine Newsletter Anmeldung: nur noch ein Schritt!</h1>
      <p>
        Wir haben dir soeben eine E-Mail geschickt. Bitte bestätige dort
        nochmals, dass du meinen Newsletter erhalten möchtest.
      </p>
    </section>
  );
}
