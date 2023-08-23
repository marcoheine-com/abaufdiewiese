import {Await, NavLink} from '@remix-run/react';
import {Suspense} from 'react';
import type {CartApiQueryFragment, HeaderQuery} from 'storefrontapi.generated';
import {Aside} from '~/components/Aside';
import {Footer} from '~/components/Footer';
import {Header, HeaderCtas, HeaderMenu} from '~/components/Header';
import {CartMain} from '~/components/Cart';
import {
  PredictiveSearchForm,
  PredictiveSearchResults,
} from '~/components/Search';
import {SanityMenuLink, SanitySocialLink} from '~/lib/sanity';

export type LayoutProps = {
  cart: Promise<CartApiQueryFragment | null>;
  children?: React.ReactNode;
  isLoggedIn: boolean;
  layout: {
    footer: {
      links: SanityMenuLink[];
      socialLinks: SanitySocialLink[];
    };
    menuLinks: SanityMenuLink[];
  };
};

export function Layout({cart, children = null, layout}: LayoutProps) {
  return (
    <>
      <CartAside cart={cart} />
      <SearchAside />
      <MobileMenuAside menuLinks={layout?.menuLinks} />
      <div className="flex flex-col items-start w-full min-h-screen">
        <Header menuLinks={layout?.menuLinks} cart={cart} />
        <main className="flex justify-center w-full mx-auto">{children}</main>
        <Footer
          links={layout.footer.links}
          socialLinks={layout.footer.socialLinks}
        />
      </div>
    </>
  );
}

function CartAside({cart}: {cart: LayoutProps['cart']}) {
  return (
    <Aside id="cart-aside" heading="Mein Körbchen">
      <Suspense fallback={<p>Körbchen wird geladen ...</p>}>
        <Await resolve={cart}>
          {(cart) => {
            return <CartMain cart={cart} layout="aside" />;
          }}
        </Await>
      </Suspense>
    </Aside>
  );
}

function SearchAside() {
  return (
    <Aside id="search-aside" heading="SEARCH">
      <div className="predictive-search">
        <br />
        <PredictiveSearchForm>
          {({fetchResults, inputRef}) => (
            <div>
              <input
                name="q"
                onChange={fetchResults}
                onFocus={fetchResults}
                placeholder="Search"
                ref={inputRef}
                type="search"
              />
              &nbsp;
              <button type="submit">Search</button>
            </div>
          )}
        </PredictiveSearchForm>
        <PredictiveSearchResults />
      </div>
    </Aside>
  );
}

function MobileMenuAside({
  menuLinks,
}: {
  menuLinks: LayoutProps['layout']['menuLinks'];
}) {
  return (
    <Aside id="mobile-menu-aside" heading="MENU">
      <HeaderMenu menuLinks={menuLinks} viewport="mobile" />
    </Aside>
  );
}
