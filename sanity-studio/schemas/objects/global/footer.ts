import {defineField} from 'sanity'

export default defineField({
  name: 'footerSettings',
  title: 'Footer',
  type: 'object',
  options: {
    collapsed: false,
    collapsible: true,
  },
  fields: [
    // Social Links
    defineField({
      name: 'socialLinks',
      title: 'Social links',
      type: 'array',
      of: [{type: 'linkSocial'}],
    }),
    // Links
    defineField({
      name: 'links',
      title: 'Links',
      type: 'array',
      of: [{type: 'linkInternal'}, {type: 'linkExternal'}],
    }),
  ],
})
