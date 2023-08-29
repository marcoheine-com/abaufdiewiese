import {defineField} from 'sanity'

export default defineField({
  name: 'contactFormSettings',
  title: 'Contact form',
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
      name: 'subtitle',
      title: 'Subtitle',
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
      type: 'array',
      of: [
        {
          lists: [],
          marks: {
            annotations: [
              // Email
              {
                title: 'Email',
                name: 'annotationLinkEmail',
                type: 'annotationLinkEmail',
              },
              // Phone
              {
                title: 'Phone',
                name: 'annotationLinkPhone',
                type: 'annotationLinkPhone',
              },
              // Internal link
              {
                title: 'Internal page',
                name: 'annotationLinkInternal',
                type: 'annotationLinkInternal',
              },
              // URL
              {
                title: 'URL',
                name: 'annotationLinkExternal',
                type: 'annotationLinkExternal',
              },
            ],
            decorators: [],
          },
          // Block styles
          styles: [{title: 'Normal', value: 'normal'}],
          type: 'block',
        },
      ],
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
