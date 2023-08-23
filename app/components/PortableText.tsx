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
  list: {
    bullet: (props: any) => <ul className="mt-2">{props.children}</ul>,
    number: (props: any) => <ol className="mt-2">{props.children}</ol>,
  },
  listItem: {
    bullet: (props: any) => (
      <li className="ml-4 list-disc">{props.children}</li>
    ),
  },
};

export default function PortableText({value}: Props) {
  return <PortabletextReact value={value} components={components} />;
}
