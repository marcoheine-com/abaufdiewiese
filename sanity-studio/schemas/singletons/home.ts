import {HomeIcon} from '@sanity/icons'
import {defineField} from 'sanity'

const TITLE = 'Home'

export default defineField({
  name: 'home',
  title: TITLE,
  type: 'document',
  icon: HomeIcon,
  groups: [
    {
      default: true,
      name: 'editorial',
      title: 'Editorial',
    },
    {
      name: 'seo',
      title: 'SEO',
    },
  ],
  fields: [
    // Hero
    defineField({
      name: 'hero',
      title: 'Hero',
      type: 'hero.home',
      group: 'editorial',
    }),
    // Modules
    defineField({
      name: 'modules',
      title: 'Modules',
      type: 'array',
      of: [
        {type: 'module.features'},
        {type: 'module.showLatestProducts'},
        {type: 'module.textmedia'},
        {type: 'module.grid'},
        {type: 'module.showContactform'},
        {type: 'module.support'},
        {type: 'module.showNewsletter'},
        {type: 'module.showHomeProducts'},
      ],
      group: 'editorial',
    }),
    // SEO
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo.home',
      group: 'seo',
    }),
  ],
  preview: {
    prepare() {
      return {
        // media: icon,
        subtitle: 'Index',
        title: TITLE,
      }
    },
  },
})
