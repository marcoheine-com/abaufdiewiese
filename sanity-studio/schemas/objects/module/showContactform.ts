import {TagIcon} from '@sanity/icons'
import {defineField} from 'sanity'

export default defineField({
  name: 'module.showContactform',
  title: 'Show Contactform',
  type: 'object',
  fields: [
    {
      name: 'showContactform',
      title: 'Show Contactform',
      type: 'boolean',
    },
  ],
  icon: TagIcon,
  preview: {
    prepare() {
      return {
        media: TagIcon,
        title: 'Show Contactform',
      }
    },
  },
})
