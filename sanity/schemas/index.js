// sanity/schemas/index.js
// Export all schemas

import author from './author';
import blockContent from './blockContent';
import category from './category';
import post from './post';
import series from './series';
import tag from './tag';

export const schemaTypes = [author, blockContent, category, post, series, tag];

export default schemaTypes;
