import {
  PortableTextComponents,
  PortableText as PortabletextReact,
} from '@portabletext/react';
import type {PortableTextBlock} from '@sanity/types';
import {Image} from '@shopify/hydrogen';
import LinkInternalAnnotation from '~/components/portableText/annotations/LinkInternal';
import AccordionBlock from '~/components/portableText/blocks/Accordion';

type Props = {
  className?: string;
  value: PortableTextBlock[];
};

const Block = (props: any) => {

  switch (props.value.style) {
    case 'h2':
      return <h2 className="first:mt-0 last:mb-0 mb-4">{props.children}</h2>;
    case 'h3':
      return <h3 className="first:mt-0 last:mb-0 mb-4">{props.children}</h3>;
    case 'h4':
      return <h4 className="first:mt-0 last:mb-0 mb-4">{props.children}</h4>;
    case 'h5':
      return <h5 className="first:mt-0 last:mb-0 mb-4">{props.children}</h5>;
    case 'h6':
      return <h6 className="first:mt-0 last:mb-0 mb-4">{props.children}</h6>;
    default:
      return <p className="first:mt-0 last:mb-0 mb-4">{props.children}</p>;
  }
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
  types: {
    'module.accordion': AccordionBlock,
    image: (props: any) => {
      return (
        <Image
          data={props.value}
          aspectRatio="1/1"
          className="object-cover w-full h-full mb-4"
          sizes="(min-width: 45em) 20vw, 50vw"
        />
      );
    },
  },
  marks: {
    annotationLinkInternal: LinkInternalAnnotation,
    annotationLinkExternal: (props: any) => {
      return (
        <a href={props.value.url} target="_blank" rel="noopener noreferrer">
          {props.children}
        </a>
      );
    },
    annotationLinkEmail: (props: any) => {
      return <a href={`mailto:${props.value.email}`}>{props.children}</a>;
    },
    annotationLinkPhone: (props: any) => {
      return <a href={`tel:${props.value.phone}`}>{props.children}</a>;
    },
  },
};

export default function PortableText({value, className}: Props) {
  return (
    <div className={className}>
      <PortabletextReact value={value} components={components} />
    </div>
  );
}
