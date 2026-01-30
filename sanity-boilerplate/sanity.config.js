// sanity.config.js (root level)
// This file is needed for Sanity CLI commands like 'sanity deploy'
// Place this file in the ROOT of your Next.js project

import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { codeInput } from '@sanity/code-input';
import { schemaTypes } from './sanity/schemas';

export default defineConfig({
  // TODO: Update these to match your project
  name: 'your-project-name',
  title: 'Your Project Name',

  // TODO: Replace with your Sanity project ID and dataset
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'your-project-id',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',

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
    codeInput(), // For code blocks in portable text
  ],

  schema: {
    types: schemaTypes,
  },

  // TODO: Customize theme colors to match your branding (optional)
  theme: {
    colors: {
      primary: {
        bg: '#008070', // Your brand color
        fg: '#ffffff',
      },
    },
  },
});
