import {
  PortableTextComponents,
  PortableText as PortabletextReact,
} from '@portabletext/react';
import type {PortableTextBlock} from '@sanity/types';
import { Image } from '@shopify/hydrogen';
import { SanityImage } from 'sanity-image';
import LinkInternalAnnotation from '~/components/portableText/annotations/LinkInternal';
import AccordionBlock from '~/components/portableText/blocks/Accordion';
import { urlFor } from '~/lib/sanity/imageUrlBuilder';


type Props = {
  className?: string;
  value: PortableTextBlock[];
};

const Block = (props: any) => {
  if (props.value.style === 'h3') {
    return (
      <h3 className={'first:mt-0 last:mb-0 mb-4 mt-16'}>{props.children}</h3>
    );
  }
  return <p className="first:mt-0 last:mb-0' mb-4">{props.children}</p>;
};


export default function PortableText({value, className}: Props) {  
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
        console.log(props)
        return (
          <Image
            src={urlFor(props.value).url()}
            className="mb-4"
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
  return (
    <div className={className}>
      <PortabletextReact value={value} components={components} />
    </div>
  );
}
