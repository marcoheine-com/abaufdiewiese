import {LinkIcon} from '@sanity/icons'
import {defineField} from 'sanity'

export default defineField({
  name: 'linkSocial',
  title: 'Social Link',
  type: 'object',
  icon: LinkIcon,
  fields: [
    // URL
    {
      title: 'URL',
      name: 'url',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    // Icon
    {
      title: 'Icon',
      name: 'icon',
      type: 'image',
      validation: (Rule) => Rule.required(),
    },
    // Open in a new window
    {
      title: 'Open in a new window?',
      name: 'newWindow',
      type: 'boolean',
      initialValue: true,
    },
  ],
  preview: {
    select: {
      url: 'url',
      icon: 'icon',
    },
    prepare(selection) {
      const {url, icon} = selection

      return {
        title: url,
        media: icon,
      }
    },
  },
})
