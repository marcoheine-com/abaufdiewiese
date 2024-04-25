import {TagIcon} from '@sanity/icons'
import {defineField} from 'sanity'

export default defineField({
  name: 'module.showAllProducts',
  title: 'Show all Products',
  type: 'object',
  fields: [
    {
      name: 'showAllProducts',
      title: 'Show all Products',
      type: 'boolean',
    },
  ],
  icon: TagIcon,
  preview: {
    prepare() {
      return {
        media: TagIcon,
        title: 'Show all Products',
      }
    },
  },
})
