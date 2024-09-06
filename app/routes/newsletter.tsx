import {useActionData, useLoaderData, useMatches} from '@remix-run/react';
import {ActionArgs, json, LoaderArgs} from '@shopify/remix-oxygen';
import Newsletter from '~/components/Newsletter';

export async function action({request, context}: ActionArgs) {
  const apiKey = context.env.BREVO_NEWSLETTER_API_KEY;
  const formData = await request.formData();
  const email = String(formData.get('email'));
  const name = String(formData.get('name'));

  try {
    const createContactResponse = await fetch(
      'https://api.brevo.com/v3/contacts',
      {
        method: 'POST',
        headers: {
          'api-key': apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          listIds: [5],
          attributes: {
            FIRSTNAME: name,
          },
          updateEnabled: true,
        }),
      },
    );

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
  const user = url.searchParams.get('user');

  if (user) {
    // TO DO: Also remove from list 5
    try {
      const response = await fetch(
        ' https://api.brevo.com/v3/contacts/lists/4/contacts/add',
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
        throw new Error(`Could not subscribe user: ${response.statusText}`);
      }

      return json({success: true});
    } catch (error) {
      console.error(error);
      return json({success: false});
    }
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

  if (!actionData) {
    return <Newsletter content={layout.newsletter} />;
  }

  return (
    <section className="content-max-width content-padding content-margin-top">
      <h1>Deine Newsletter Anmeldung: nur noch ein Schritt!</h1>
      <p>
        Wir haben dir soeben eine E-Mail an {actionData.email} geschickt. Bitte
        bestätige dort nochmals, dass du meinen Newsletter erhalten möchtest.
      </p>
    </section>
  );
}
