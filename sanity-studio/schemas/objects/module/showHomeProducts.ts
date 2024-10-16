import {TagIcon} from '@sanity/icons'
import {defineField} from 'sanity'

export default defineField({
  name: 'module.showHomeProducts',
  title: 'Show Home Products',
  type: 'object',
  fields: [
    {
      name: 'showHomeProducts',
      title: 'Show Home Products',
      type: 'boolean',
    },
  ],
  icon: TagIcon,
  preview: {
    prepare() {
      return {
        media: TagIcon,
        title: 'Show Home Products',
      }
    },
  },
})
