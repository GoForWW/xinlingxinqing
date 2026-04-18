import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './sanity/schemas'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!

export default defineConfig({
  basePath: '/studio',
  projectId,
  dataset,
  title: '心靈心情 Blog Studio',
  schema: {
    types: schemaTypes,
  },
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('心靈心情')
          .items([
            S.listItem()
              .id('all-posts')
              .title('文章')
              .child(
                S.documentList()
                  .id('post-list')
                  .title('所有文章')
                  .filter('_type == "post"')
                  .defaultOrdering([{ field: 'publishedAt', direction: 'desc' }])
              ),
            S.listItem()
              .id('categories')
              .title('分類')
              .child(S.documentTypeList('category').id('category-list')),
            S.listItem()
              .id('authors')
              .title('作者')
              .child(S.documentTypeList('author').id('author-list')),
            S.divider(),
            S.listItem()
              .id('new-post')
              .title('新增文章')
              .child(
                S.document()
                  .schemaType('post')
                  .documentId('post-draft')
                  .title('撰寫新文章')
              ),
          ]),
    }),
    visionTool(),
  ],
})
