import {TagIcon} from '@sanity/icons'
import {defineField} from 'sanity'

export default defineField({
  name: 'module.features',
  title: 'Features',
  type: 'object',
  icon: TagIcon,
  fields: [
    defineField({
      name: 'feature',
      title: 'Feature',
      type: 'array',
      of: [
        {
          type: 'feature',
        },
      ],
    }),
  ],

  preview: {
    select: {
      title: 'feature',
    },
    prepare({title}) {
      return {
        title: `Features`,
      }
    },
  },
})
