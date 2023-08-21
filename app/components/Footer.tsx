import {useMatches, NavLink} from '@remix-run/react';
import {LayoutProps} from '~/components/Layout';

type Props = {
  links: LayoutProps['layout']['footer']['links'];
};
export function Footer({links}: Props) {
  const [root] = useMatches();
  const publicStoreDomain = root?.data?.publicStoreDomain;

  return (
    <footer className="mt-auto w-full">
      <div className="content-margin-top bg-primaryVariant w-full">
        <nav
          className="flex items-center gap-4 content-padding py-8 md:gap-8 mx-auto max-w-[1920px] justify-center uppercase text-primaryText"
          role="navigation"
        >
          {links?.map((item) => {
            if (!item.slug) return null;
            return (
              <NavLink
                end
                key={item._key}
                prefetch="intent"
                style={activeLinkStyle}
                to={item.slug}
              >
                {item.title}
              </NavLink>
            );
          })}
        </nav>
      </div>
    </footer>
  );
}

function activeLinkStyle({isActive}: {isActive: boolean; isPending: boolean}) {
  return {
    fontWeight: isActive ? 'bold' : '',
  };
}
