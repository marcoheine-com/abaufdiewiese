import {TagIcon} from '@sanity/icons'
import {defineField} from 'sanity'

export default defineField({
  name: 'module.showProducts',
  title: 'Show Products',
  type: 'object',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
    },
  ],
  icon: TagIcon,
})
