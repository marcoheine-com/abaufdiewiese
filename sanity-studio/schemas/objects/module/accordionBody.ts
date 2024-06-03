import {defineField} from 'sanity'

export default defineField({
  name: 'accordionBody',
  title: 'Body',
  type: 'array',
  of: [
    {
      lists: [],
      marks: {
        annotations: [
          // Email
          {
            name: 'annotationLinkEmail',
            type: 'annotationLinkEmail',
          },
          // Internal link
          {
            name: 'annotationLinkInternal',
            type: 'annotationLinkInternal',
          },
          // URL
          {
            name: 'annotationLinkExternal',
            type: 'annotationLinkExternal',
          },
        ],
        decorators: [
          {
            title: 'Italic',
            value: 'em',
          },
          {
            title: 'Strong',
            value: 'strong',
          },
        ],
      },
      // Regular styles
      styles: [
        {title: 'Normal', value: 'normal'},
        {title: 'Heading 3', value: 'h3'},
      ],
      // Paragraphs
      type: 'block',
    },
    {
      type: 'image',
      options: {
        hotspot: true
      },
    },
  ],
})
