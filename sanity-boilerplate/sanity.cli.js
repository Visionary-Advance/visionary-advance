// sanity.cli.js (root level)
// Sanity CLI configuration
// Place this file in the ROOT of your Next.js project

import { defineCliConfig } from 'sanity/cli';

export default defineCliConfig({
  api: {
    // TODO: Replace with your Sanity project ID and dataset
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'your-project-id',
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  },

  // TODO: Set your studio hostname for hosted Sanity Studio (optional)
  // This allows you to deploy your studio to: your-studio-name.sanity.studio
  studioHost: 'your-studio-name',
});
