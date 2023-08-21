import {defineField} from 'sanity'

export default defineField({
  name: 'feature',
  title: 'Feature',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'image',
      options: {hotspot: true},
      validation: (Rule) => Rule.required(),
    }),
  ],
})
