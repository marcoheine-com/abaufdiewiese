import {Await, NavLink} from '@remix-run/react';
import {Suspense} from 'react';
import type {LayoutProps} from './Layout';

type HeaderProps = Pick<LayoutProps, 'cart'> & {
  menuLinks: LayoutProps['layout']['menuLinks'];
};

type Viewport = 'desktop' | 'mobile';

export function Header({cart, menuLinks}: HeaderProps) {
  return (
    <header className="flex top-0 sticky w-full bg-white items-center mx-auto z-[1] content-max-width content-padding">
      <NavLink prefetch="intent" to="/" style={activeLinkStyle} end>
        <img
          src="/images/abaufdiewiese.png"
          alt="abaufdiewiese"
          width="100px"
          height="100px"
        />
      </NavLink>
      <HeaderMenu menuLinks={menuLinks} viewport="desktop" />
      <HeaderCtas cart={cart} />
    </header>
  );
}

export function HeaderMenu({
  menuLinks,
  viewport,
}: {
  menuLinks: HeaderProps['menuLinks'];
  viewport: Viewport;
}) {
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

export function HeaderCtas({cart}: Pick<HeaderProps, 'cart'>) {
  return (
    <nav className="header-ctas" role="navigation">
      <a className="header-menu-mobile-toggle" href="#mobile-menu-aside">
        <h3>☰
        <span className="absolute top-auto h-[1px] w-[1px] overflow-hidden whitespace-nowrap">
          Mobile Menu Toggle
        </span>
        </h3>
      </a>

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
  return (
    <a href="#cart-aside" className="flex gap-2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 576 512"
        width={24}
        height={24}
      >
        <path d="M0 24C0 10.7 10.7 0 24 0H69.5c22 0 41.5 12.8 50.6 32h411c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3H170.7l5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5H488c13.3 0 24 10.7 24 24s-10.7 24-24 24H199.7c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5H24C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z" />
      </svg>
      <span className="absolute top-auto h-[1px] w-[1px] overflow-hidden whitespace-nowrap">
        Warenkorb
      </span>
      <span className="hidden sm:block">Mein Körbchen</span>{' '}
      {count === 0 ? '' : count}
    </a>
  );
}

export function CartToggle({cart}: Pick<HeaderProps, 'cart'>) {
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

export function activeLinkStyle({
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
