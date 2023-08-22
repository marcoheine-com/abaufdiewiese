import {defineField} from 'sanity'

export default defineField({
  name: 'supportItem',
  title: 'Support',
  type: 'object',
  fields: [
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {hotspot: true},
      validation: (Rule) => Rule.required(),
    }),
  ],

  preview: {
    select: {
      image: 'image',
      fileName: 'image.asset.originalFilename',
    },
    prepare(selection) {
      const {image, fileName} = selection
      return {
        media: image,
        title: fileName,
      }
    },
  },
})
