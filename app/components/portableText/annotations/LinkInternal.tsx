import type {PortableTextMarkComponentProps} from '@portabletext/react';
import {NavLink} from '@remix-run/react';

type Props = PortableTextMarkComponentProps & {
  value?: PortableTextMarkComponentProps['value'] & {
    slug?: string;
  };
};

export default function LinkInternalAnnotation({children, value}: Props) {
  if (!value?.slug) {
    return null;
  }

  return (
    <NavLink
      to={`/${value?.slug}`}
      className="self-center text-center mt-8 flex gap-2 border-0"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 448 512"
        fill="#FFEC9B"
        width={24}
        height={24}
      >
        <path d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z" />
      </svg>
      <span className="border-b-2 border-b-primaryVariant">
        <>{children}</>
      </span>
    </NavLink>
  );
}
