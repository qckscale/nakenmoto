import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'homePage',
  title: 'Home Page',
  type: 'document',
  fields: [
    defineField({
      title: 'Hero Slides',
      name: 'heroSlides',
      description: 'Products to feature in the hero slider (max 5)',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'product'}]}],
      validation: (Rule) => Rule.max(5),
    }),
    defineField({
      title: 'Call-to-action Primary text',
      name: 'ctaPrimary',
      type: 'localeString',
    }),

    defineField({
      title: 'Featured products title',
      name: 'featuredProductsTitle',
      type: 'localeString',
    }),
    defineField({
      title: 'Featured Products',
      name: 'featuredProducts',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'product'}]}],
    }),
    defineField({
      title: 'Blog title',
      name: 'newsTitle',
      type: 'localeString',
    }),
    defineField({
      title: 'Testimonial title',
      name: 'testimonialTitle',
      type: 'localeString',
    }),
    defineField({
      title: 'Testimonial sub-title text',
      name: 'testimonialSubtitle',
      type: 'localeBlockContent',
    }),
  ],
})
