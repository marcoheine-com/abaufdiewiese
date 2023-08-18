import {Await} from '@remix-run/react';
import {Suspense} from 'react';
import type {
  CartApiQueryFragment,
  FooterQuery,
  HeaderQuery,
} from 'storefrontapi.generated';
import {Aside} from '~/components/Aside';
import {Footer} from '~/components/Footer';
import {Header, HeaderMenu} from '~/components/Header';
import {CartMain} from '~/components/Cart';
import {
  PredictiveSearchForm,
  PredictiveSearchResults,
} from '~/components/Search';
import {SanityMenuLink} from '~/lib/sanity';

export type LayoutProps = {
  cart: Promise<CartApiQueryFragment | null>;
  children?: React.ReactNode;
  header: HeaderQuery;
  isLoggedIn: boolean;
  layout: {
    footer: {
      links: SanityMenuLink[];
    };
    menuLinks: SanityMenuLink[];
  };
};

export function Layout({cart, children = null, header, layout}: LayoutProps) {
  return (
    <>
      <CartAside cart={cart} />
      <SearchAside />
      <MobileMenuAside menu={header.menu} menuLinks={layout?.menuLinks} />
      <div className="flex flex-col items-start w-full min-h-screen">
        <Header header={header} menuLinks={layout?.menuLinks} cart={cart} />
        <main className="flex justify-center w-full mx-auto">{children}</main>
        <Footer links={layout.footer.links} />
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
  menu,
  menuLinks,
}: {
  menu: HeaderQuery['menu'];
  menuLinks: LayoutProps['layout']['menuLinks'];
}) {
  return (
    <Aside id="mobile-menu-aside" heading="MENU">
      <HeaderMenu menu={menu} menuLinks={menuLinks} viewport="mobile" />
    </Aside>
  );
}
