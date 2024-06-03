import imageUrlBuilder from '@sanity/image-url';
import {sanityClient} from '~/lib/sanity/client';

const builder = imageUrlBuilder(sanityClient)
export const urlFor = (source: any) => builder.image(source)