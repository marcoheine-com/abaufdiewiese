import {NavLink} from '@remix-run/react';
import {Image} from '@shopify/hydrogen';
import {LayoutProps} from '~/components/Layout';

type Props = {
  links: LayoutProps['layout']['footer']['links'];
  socialLinks: LayoutProps['layout']['footer']['socialLinks'];
};
export function Footer({links, socialLinks}: Props) {
  return (
    <footer className="mt-auto w-full content-max-width">
      <div className="content-margin-top bg-primaryVariant w-full">
        <nav
          className="flex flex-col items-center gap-8 md:justify-center content-padding py-8 mx-auto content-max-width uppercase text-primaryText md:relative"
          role="navigation"
        >
          <div className="flex gap-4 lg:absolute lg:left-24 xl:left-36">
            {socialLinks?.map((item) => {
              if (!item.url) return null;
              return (
                <NavLink
                  end
                  key={item._key}
                  prefetch="none"
                  to={item.url}
                  target={item.newWindow ? '_blank' : undefined}
                >
                  <Image className="w-8 h-8" sizes="8x8" data={item.icon} />
                  <span className="absolute top-auto h-[1px] w-[1px] overflow-hidden whitespace-nowrap">
                    Link to {item.url}
                  </span>
                </NavLink>
              );
            })}
          </div>
          <div className="flex flex-col gap-4 text-center lg:flex-row lg:gap-8">
            {links?.map((item) => {
              if (!item.slug) return null;
              return (
                <NavLink
                  end
                  key={item._key}
                  prefetch="intent"
                  to={item.slug}
                >
                  {item.title}
                </NavLink>
              );
            })}
          </div>
        </nav>
      </div>
    </footer>
  );
}
