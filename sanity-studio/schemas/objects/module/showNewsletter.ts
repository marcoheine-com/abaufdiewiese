import {TagIcon} from '@sanity/icons'
import {defineField} from 'sanity'

export default defineField({
  name: 'module.showNewsletter',
  title: 'Show Newsletter',
  type: 'object',
  fields: [
    {
      name: 'showNewsletter',
      title: 'Show Newsletter',
      type: 'boolean',
    },
  ],
  icon: TagIcon,
  preview: {
    prepare() {
      return {
        media: TagIcon,
        title: 'Show Newsletter',
      }
    },
  },
})
