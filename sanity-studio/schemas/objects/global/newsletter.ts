import {defineField} from 'sanity'

export default defineField({
  name: 'newsletterSettings',
  title: 'Newsletter',
  type: 'object',
  options: {
    collapsed: false,
    collapsible: true,
  },
  fields: [
    // Title
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
    }),
    // Text
    defineField({
      name: 'text',
      title: 'Text',
      type: 'body',
    }),
  ],

  preview: {
    select: {
      title: 'title',
    },
    prepare(selection) {
      const {title} = selection
      return {
        title,
      }
    },
  },
})
