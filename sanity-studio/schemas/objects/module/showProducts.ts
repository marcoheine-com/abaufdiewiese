import {TagIcon} from '@sanity/icons'
import {defineField} from 'sanity'

export default defineField({
  name: 'module.showProducts',
  title: 'Show Products',
  type: 'object',
  fields: [
    {
      name: 'showProducts',
      title: 'Show Products',
      type: 'boolean',
    },
  ],
  icon: TagIcon,
  preview: {
    prepare() {
      return {
        media: TagIcon,
        title: 'Show Products',
      }
    },
  },
})
