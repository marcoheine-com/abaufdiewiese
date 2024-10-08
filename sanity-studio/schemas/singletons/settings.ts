import {CogIcon} from '@sanity/icons'
import {defineType, defineField} from 'sanity'

const TITLE = 'Settings'

export default defineType({
  name: 'settings',
  title: TITLE,
  type: 'document',
  icon: CogIcon,
  groups: [
    {
      default: true,
      name: 'navigation',
      title: 'Navigation',
    },
    {
      name: 'contactForm',
      title: 'Contact form',
    },
    {
      name: 'notFoundPage',
      title: '404 page',
    },
    {
      name: 'seo',
      title: 'SEO',
    },
    {
      name: 'newsletter',
      title: 'Newsletter',
    },
  ],
  fields: [
    // Menu
    defineField({
      name: 'menu',
      title: 'Header',
      type: 'menuSettings',
      group: 'navigation',
    }),
    // Footer
    defineField({
      name: 'footer',
      title: 'Footer',
      type: 'footerSettings',
      group: 'navigation',
    }),
    defineField({
      name: 'contactForm',
      title: 'Contact Form',
      type: 'contactFormSettings',
      group: 'contactForm',
    }),
    // Not found page
    defineField({
      name: 'notFoundPage',
      title: '404 page',
      type: 'notFoundPage',
      group: 'notFoundPage',
    }),
    // SEO
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      group: 'seo',
    }),
    defineField({
      name: 'newsletter',
      title: 'Newsletter',
      type: 'newsletterSettings',
      group: 'newsletter',
    }),
  ],
  preview: {
    prepare() {
      return {
        title: TITLE,
      }
    },
  },
})
