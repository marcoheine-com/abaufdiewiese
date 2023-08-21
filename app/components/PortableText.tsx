import {
  PortableTextComponents,
  PortableText as PortabletextReact,
} from '@portabletext/react';
import type {PortableTextBlock} from '@sanity/types';

type Props = {
  value: PortableTextBlock[];
};

const Block = (props: any) => {
  return <p className="first:mt-0 last:mb-0' mb-4">{props.children}</p>;
};
const components: PortableTextComponents = {
  block: Block,
};

export default function PortableText({value}: Props) {
  return <PortabletextReact value={value} components={components} />;
}
