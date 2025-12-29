// sanity/sanity.config.js
// Sanity Studio configuration

import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { codeInput } from '@sanity/code-input';
import { schemaTypes } from './schemas';

export default defineConfig({
  name: 'visionary-advance-blog',
  title: 'Visionary Advance Blog',

  projectId: 'g84uoyk7',
  dataset: 'production',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            // Posts with custom views
            S.listItem()
              .title('Posts')
              .child(
                S.list()
                  .title('Posts')
                  .items([
                    S.listItem()
                      .title('Published Posts')
                      .child(
                        S.documentList()
                          .title('Published')
                          .filter('_type == "post" && publishedAt < now()')
                          .defaultOrdering([{ field: 'publishedAt', direction: 'desc' }])
                      ),
                    S.listItem()
                      .title('Draft Posts')
                      .child(
                        S.documentList()
                          .title('Drafts')
                          .filter('_type == "post" && publishedAt > now()')
                          .defaultOrdering([{ field: '_createdAt', direction: 'desc' }])
                      ),
                    S.listItem()
                      .title('Featured Posts')
                      .child(
                        S.documentList()
                          .title('Featured')
                          .filter('_type == "post" && featured == true')
                          .defaultOrdering([{ field: 'publishedAt', direction: 'desc' }])
                      ),
                    S.divider(),
                    S.listItem()
                      .title('All Posts')
                      .child(
                        S.documentTypeList('post')
                          .title('All Posts')
                          .defaultOrdering([{ field: 'publishedAt', direction: 'desc' }])
                      ),
                  ])
              ),
            S.divider(),
            // Categories
            S.listItem()
              .title('Categories')
              .child(S.documentTypeList('category').title('Categories')),
            // Tags
            S.listItem()
              .title('Tags')
              .child(S.documentTypeList('tag').title('Tags')),
            // Series
            S.listItem()
              .title('Series')
              .child(S.documentTypeList('series').title('Series')),
            S.divider(),
            // Authors
            S.listItem()
              .title('Authors')
              .child(S.documentTypeList('author').title('Authors')),
          ]),
    }),
    visionTool(), // GROQ query playground
    codeInput(), // For code blocks
  ],

  schema: {
    types: schemaTypes,
  },

  // Customize theme to match Visionary Advance branding
  theme: {
    colors: {
      primary: {
        bg: '#008070',
        fg: '#ffffff',
      },
    },
  },
});
