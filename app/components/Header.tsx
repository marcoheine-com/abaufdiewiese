import {Await, NavLink, useMatches} from '@remix-run/react';
import {Suspense} from 'react';
import type {LayoutProps} from './Layout';

type HeaderProps = Pick<LayoutProps, 'header' | 'cart'> & {
  menuLinks: LayoutProps['layout']['menuLinks'];
};

type Viewport = 'desktop' | 'mobile';

export function Header({header, cart, menuLinks}: HeaderProps) {
  const {shop, menu} = header;
  return (
    <header className="flex top-0 sticky p-4 w-full bg-white items-center mx-auto z-[1] max-w-[1920px]">
      <NavLink prefetch="intent" to="/" style={activeLinkStyle} end>
        <img
          src="/images/abaufdiewiese.png"
          alt="abaufdiewiese"
          width="100px"
          height="100px"
        />
      </NavLink>
      <HeaderMenu menu={menu} menuLinks={menuLinks} viewport="desktop" />
      <HeaderCtas cart={cart} />
    </header>
  );
}

export function HeaderMenu({
  menuLinks,
  viewport,
}: {
  menu: HeaderProps['header']['menu'];
  menuLinks: HeaderProps['menuLinks'];
  viewport: Viewport;
}) {
  const [root] = useMatches();
  const publicStoreDomain = root?.data?.publicStoreDomain;
  const className = `header-menu-${viewport}`;

  function closeAside(event: React.MouseEvent<HTMLAnchorElement>) {
    if (viewport === 'mobile') {
      event.preventDefault();
      window.location.href = event.currentTarget.href;
    }
  }

  return (
    <nav className={className} role="navigation">
      {menuLinks?.map((item) => {
        if (!item.slug) return null;

        return (
          <NavLink
            className="header-menu-item"
            end
            key={item._key}
            onClick={closeAside}
            prefetch="intent"
            style={activeLinkStyle}
            to={item.slug}
          >
            {item.title}
          </NavLink>
        );
      })}
    </nav>
  );
}

function HeaderCtas({cart}: Pick<HeaderProps, 'cart'>) {
  return (
    <nav className="header-ctas" role="navigation">
      <HeaderMenuMobileToggle />

      <CartToggle cart={cart} />
    </nav>
  );
}

function HeaderMenuMobileToggle() {
  return (
    <a className="header-menu-mobile-toggle" href="#mobile-menu-aside">
      <h3>☰</h3>
    </a>
  );
}

function CartBadge({count}: {count: number}) {
  return <a href="#cart-aside">Mein Körbchen {count}</a>;
}

function CartToggle({cart}: Pick<HeaderProps, 'cart'>) {
  return (
    <Suspense fallback={<CartBadge count={0} />}>
      <Await resolve={cart}>
        {(cart) => {
          if (!cart) return <CartBadge count={0} />;
          return <CartBadge count={cart.totalQuantity || 0} />;
        }}
      </Await>
    </Suspense>
  );
}

function activeLinkStyle({
  isActive,
  isPending,
}: {
  isActive: boolean;
  isPending: boolean;
}) {
  return {
    fontWeight: isActive ? 'bold' : '',
    color: isPending ? 'grey' : 'black',
  };
}
