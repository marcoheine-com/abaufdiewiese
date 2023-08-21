import {ImageIcon} from '@sanity/icons'
import {defineField} from 'sanity'

export default defineField({
  name: 'module.textmedia',
  title: 'Text & Media',
  icon: ImageIcon,
  type: 'object',
  fields: [
    {
      name: 'text',
      title: 'Text',
      type: 'array',
      of: [
        {
          type: 'block',
        },
      ],
    },
    {
      name: 'media',
      title: 'Media',
      type: 'image',
    },
  ],
  preview: {
    select: {
      title: 'text',
    },
    prepare({title}) {
      return {
        title: `Text & Media`,
      }
    },
  },
})
