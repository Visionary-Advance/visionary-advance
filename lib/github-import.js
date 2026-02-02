// lib/github-import.js
// GitHub API integration for importing repositories into SystemForge vault

import { Octokit } from '@octokit/rest'

// File extensions to include in import
const ALLOWED_EXTENSIONS = [
  'js', 'jsx', 'ts', 'tsx', 'css', 'scss', 'html', 'json', 'md',
  'py', 'sql', 'sh', 'yaml', 'yml', 'env', 'txt', 'svg'
]

// Paths to ignore
const IGNORED_PATHS = [
  'node_modules',
  '.git',
  '.next',
  'dist',
  'build',
  '.vercel',
  '__pycache__',
  '.cache',
  'coverage',
  '.nyc_output'
]

// Max file size (100KB)
const MAX_FILE_SIZE = 100 * 1024

/**
 * Parse a GitHub URL to extract owner and repo
 */
export function parseGitHubUrl(url) {
  // Handle various URL formats
  const patterns = [
    /github\.com\/([^\/]+)\/([^\/\?#]+)/,
    /github\.com:([^\/]+)\/([^\/\?#]+)/,
    /^([^\/]+)\/([^\/\?#]+)$/
  ]

  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) {
      return {
        owner: match[1],
        repo: match[2].replace(/\.git$/, '')
      }
    }
  }

  throw new Error('Invalid GitHub URL format')
}

/**
 * Create an Octokit client
 */
function createOctokit() {
  const token = process.env.GITHUB_TOKEN

  if (!token) {
    throw new Error('GITHUB_TOKEN environment variable is required')
  }

  return new Octokit({ auth: token })
}

/**
 * Fetch repository tree (all files/folders)
 */
export async function fetchRepoTree(owner, repo, branch = 'main') {
  const octokit = createOctokit()

  try {
    // Try to get the tree for the specified branch
    const { data } = await octokit.git.getTree({
      owner,
      repo,
      tree_sha: branch,
      recursive: 'true'
    })

    return data.tree
  } catch (error) {
    // If main fails, try master
    if (branch === 'main') {
      try {
        const { data } = await octokit.git.getTree({
          owner,
          repo,
          tree_sha: 'master',
          recursive: 'true'
        })
        return data.tree
      } catch {
        throw error
      }
    }
    throw error
  }
}

/**
 * Filter tree to only include allowed files
 */
export function filterTree(tree) {
  return tree.filter(item => {
    // Only include blobs (files)
    if (item.type !== 'blob') return false

    // Check if path contains ignored directories
    const pathParts = item.path.split('/')
    if (pathParts.some(part => IGNORED_PATHS.includes(part))) {
      return false
    }

    // Check file extension
    const ext = item.path.split('.').pop()?.toLowerCase()
    if (!ALLOWED_EXTENSIONS.includes(ext)) return false

    // Check file size (if available)
    if (item.size && item.size > MAX_FILE_SIZE) return false

    return true
  })
}

/**
 * Fetch content of a single file
 */
export async function fetchFileContent(owner, repo, path, ref = 'main') {
  const octokit = createOctokit()

  const { data } = await octokit.repos.getContent({
    owner,
    repo,
    path,
    ref
  })

  if ('content' in data && data.encoding === 'base64') {
    return Buffer.from(data.content, 'base64').toString('utf-8')
  }

  throw new Error('Unable to fetch file content')
}

/**
 * Fetch contents of multiple files
 */
export async function fetchMultipleFiles(owner, repo, paths, ref = 'main') {
  const results = []
  const BATCH_SIZE = 10

  // Process in batches to avoid rate limiting
  for (let i = 0; i < paths.length; i += BATCH_SIZE) {
    const batch = paths.slice(i, i + BATCH_SIZE)
    const batchResults = await Promise.all(
      batch.map(async (path) => {
        try {
          const content = await fetchFileContent(owner, repo, path, ref)
          return {
            path,
            content,
            success: true
          }
        } catch (error) {
          return {
            path,
            content: null,
            success: false,
            error: error.message
          }
        }
      })
    )
    results.push(...batchResults)
  }

  return results
}

/**
 * Analyze a repository and suggest module breakdown
 */
export async function analyzeRepository(owner, repo, branch = 'main') {
  // Get the full tree
  const tree = await fetchRepoTree(owner, repo, branch)

  // Filter to allowed files
  const filteredTree = filterTree(tree)

  // Group files by directory for suggesting modules
  const directoryGroups = {}

  for (const file of filteredTree) {
    const parts = file.path.split('/')
    const directory = parts.length > 1 ? parts.slice(0, -1).join('/') : '(root)'

    if (!directoryGroups[directory]) {
      directoryGroups[directory] = []
    }
    directoryGroups[directory].push(file)
  }

  // Suggest modules based on directory structure
  const suggestedModules = []

  // Common module patterns
  const modulePatterns = [
    { pattern: /^components?$/i, type: 'component' },
    { pattern: /^pages?$/i, type: 'module' },
    { pattern: /^lib$/i, type: 'module' },
    { pattern: /^utils?$/i, type: 'snippet' },
    { pattern: /^helpers?$/i, type: 'snippet' },
    { pattern: /^hooks?$/i, type: 'component' },
    { pattern: /^api$/i, type: 'module' },
    { pattern: /^styles?$/i, type: 'snippet' },
  ]

  for (const [directory, files] of Object.entries(directoryGroups)) {
    // Determine type based on directory name
    let type = 'module'
    const dirName = directory.split('/').pop()

    for (const { pattern, type: matchType } of modulePatterns) {
      if (pattern.test(dirName)) {
        type = matchType
        break
      }
    }

    suggestedModules.push({
      name: directory === '(root)' ? repo : dirName,
      directory,
      type,
      files: files.map(f => ({
        path: f.path,
        size: f.size
      })),
      fileCount: files.length
    })
  }

  return {
    owner,
    repo,
    branch,
    totalFiles: filteredTree.length,
    suggestedModules,
    tree: filteredTree
  }
}

/**
 * Import selected files from a repository
 */
export async function importFromGitHub(owner, repo, selectedFiles, branch = 'main') {
  // Fetch file contents
  const paths = selectedFiles.map(f => f.path)
  const fileContents = await fetchMultipleFiles(owner, repo, paths, branch)

  // Return files with content ready for vault insertion
  return fileContents
    .filter(f => f.success)
    .map(f => ({
      file_path: f.path,
      content: f.content,
      language: detectLanguageFromPath(f.path)
    }))
}

/**
 * Detect language from file path
 */
function detectLanguageFromPath(filePath) {
  const ext = filePath.split('.').pop()?.toLowerCase()
  const langMap = {
    js: 'javascript',
    jsx: 'javascript',
    ts: 'typescript',
    tsx: 'typescript',
    css: 'css',
    scss: 'scss',
    html: 'html',
    json: 'json',
    md: 'markdown',
    py: 'python',
    sql: 'sql',
    sh: 'shell',
    yaml: 'yaml',
    yml: 'yaml',
    env: 'shell',
  }
  return langMap[ext] || 'text'
}

/**
 * Get repository info
 */
export async function getRepoInfo(owner, repo) {
  const octokit = createOctokit()

  const { data } = await octokit.repos.get({
    owner,
    repo
  })

  return {
    name: data.name,
    fullName: data.full_name,
    description: data.description,
    defaultBranch: data.default_branch,
    isPrivate: data.private,
    language: data.language,
    stars: data.stargazers_count,
    forks: data.forks_count
  }
}
