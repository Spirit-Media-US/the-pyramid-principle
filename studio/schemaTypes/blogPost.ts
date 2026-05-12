// blogPost — straight WP → Sanity migration target. No editorial constraints
// beyond what's needed for the post page + homepage carousel.
//
// Required: title, slug, publishDate
// Optional: heroImage, cardImage, excerpt, body (portable text)
//
// The body field accepts paragraphs (normal), H2/H3 headings, bold/italic
// decorators, inline links, and embedded images. Matches the simple
// long-form blog template the source WordPress site used.
export default {
  name: 'blogPost',
  title: 'Blog Posts',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'publishDate',
      title: 'Publish Date',
      type: 'date',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 2,
      description: 'Short summary for SEO + card previews (~150 chars).',
    },
    {
      name: 'cardImage',
      title: 'Card thumbnail (homepage carousel)',
      type: 'image',
      options: { hotspot: true },
      fields: [
        { name: 'alt', title: 'Alt text', type: 'string' },
      ],
    },
    {
      name: 'heroImage',
      title: 'Hero image (top of post)',
      type: 'image',
      options: { hotspot: true },
      fields: [
        { name: 'alt', title: 'Alt text', type: 'string' },
      ],
    },
    {
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'Heading 2', value: 'h2' },
            { title: 'Heading 3', value: 'h3' },
          ],
          marks: {
            decorators: [
              { title: 'Bold', value: 'strong' },
              { title: 'Italic', value: 'em' },
            ],
            annotations: [
              {
                name: 'link',
                title: 'Link',
                type: 'object',
                fields: [
                  { name: 'href', title: 'URL', type: 'url' },
                ],
              },
            ],
          },
        },
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            { name: 'alt', title: 'Alt text', type: 'string' },
            { name: 'caption', title: 'Caption', type: 'string' },
          ],
        },
      ],
    },
  ],
  orderings: [
    {
      title: 'Publish Date, newest first',
      name: 'publishDateDesc',
      by: [{ field: 'publishDate', direction: 'desc' }],
    },
  ],
  preview: {
    select: { title: 'title', date: 'publishDate', media: 'cardImage' },
    prepare(s: any) {
      return { title: s.title, subtitle: s.date || 'No publish date', media: s.media };
    },
  },
};
