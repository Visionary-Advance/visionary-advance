// lib/seo-shippable.js
// Which plan tasks get a Ship button. Shared by the server (lib/seo-ship.js) and the
// plan view, so it has no imports.
//
// The Ship Action runs Claude Code inside the full client repo with write access, so it
// can find the files itself and create new ones (a new service page, a sitemap entry).
// A file list from the plan is a head start, not a requirement.

/** Categories that are website changes, so Claude can do them in the client repo. */
export const CODE_CATEGORIES = ['technical', 'on-page', 'content'];

export function isShippable(task) {
  if (!task) return false;
  if (task.claude_code_prompt) return true;
  return CODE_CATEGORIES.includes(task.category);
}
