// sanity/sanity.cli.js
// Sanity CLI configuration

import { defineCliConfig } from 'sanity/cli';

export default defineCliConfig({
  api: {
    projectId: 'g84uoyk7',
    dataset: 'production',
  },

  // Studio hostname for hosted studio
  studioHost: 'visionaryadvance',
});
