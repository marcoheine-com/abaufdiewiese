import {TagIcon} from '@sanity/icons'
import {defineField} from 'sanity'

export default defineField({
  name: 'module.showLatestProducts',
  title: 'Show latest Products',
  type: 'object',
  fields: [
    {
      name: 'showLatestProducts',
      title: 'Show latest Products',
      type: 'boolean',
    },
  ],
  icon: TagIcon,
  preview: {
    prepare() {
      return {
        media: TagIcon,
        title: 'Show latest Products',
      }
    },
  },
})
