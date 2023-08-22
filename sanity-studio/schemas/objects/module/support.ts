import {ImageIcon} from '@sanity/icons'
import {defineField} from 'sanity'
import pluralize from 'pluralize-esm'

export default defineField({
  name: 'module.support',
  title: 'Support',
  type: 'object',
  icon: ImageIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'text',
      title: 'Text',
      type: 'text',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'supportItems',
      title: 'Support Items',
      type: 'array',
      of: [
        {
          type: 'supportItem',
        },
      ],
    }),
  ],

  preview: {
    select: {
      title: 'support',
      supportItems: 'supportItems',
    },
    prepare(selection) {
      const {supportItems} = selection
      return {
        subtitle: 'Support',
        title: supportItems?.length > 0 ? pluralize('item', supportItems.length, true) : 'No items',
      }
    },
  },
})
