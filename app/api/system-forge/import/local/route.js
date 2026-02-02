// app/api/system-forge/import/local/route.js
import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

// Allowed base directories for security
const ALLOWED_DIRECTORIES = [
  process.cwd(),
  // Add other allowed paths as needed
]

// File extensions to include
const ALLOWED_EXTENSIONS = [
  '.js', '.jsx', '.ts', '.tsx', '.css', '.scss', '.html', '.json', '.md',
  '.py', '.sql', '.sh', '.yaml', '.yml', '.env', '.txt', '.svg'
]

// Paths to ignore
const IGNORED_PATTERNS = [
  'node_modules',
  '.git',
  '.next',
  'dist',
  'build',
  '.vercel',
  '__pycache__',
  '.cache',
  'coverage'
]

function isPathAllowed(filePath) {
  const resolved = path.resolve(filePath)
  return ALLOWED_DIRECTORIES.some(dir => resolved.startsWith(path.resolve(dir)))
}

function shouldIgnore(filePath) {
  return IGNORED_PATTERNS.some(pattern => filePath.includes(pattern))
}

function isAllowedExtension(filePath) {
  const ext = path.extname(filePath).toLowerCase()
  return ALLOWED_EXTENSIONS.includes(ext)
}

async function getFilesRecursively(dir, baseDir = dir) {
  const files = []
  const entries = await fs.readdir(dir, { withFileTypes: true })

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    const relativePath = path.relative(baseDir, fullPath)

    if (shouldIgnore(relativePath)) continue

    if (entry.isDirectory()) {
      const subFiles = await getFilesRecursively(fullPath, baseDir)
      files.push(...subFiles)
    } else if (entry.isFile() && isAllowedExtension(entry.name)) {
      const stats = await fs.stat(fullPath)
      // Skip files larger than 100KB
      if (stats.size <= 100 * 1024) {
        files.push({
          path: relativePath.replace(/\\/g, '/'),
          fullPath,
          size: stats.size
        })
      }
    }
  }

  return files
}

function detectLanguage(filePath) {
  const ext = path.extname(filePath).toLowerCase().slice(1)
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

export async function POST(request) {
  try {
    const data = await request.json()
    const { action, paths, selectedFiles } = data

    // Action: analyze - Scan directories and list files
    if (action === 'analyze') {
      if (!paths || paths.length === 0) {
        return NextResponse.json(
          { error: 'No paths provided' },
          { status: 400 }
        )
      }

      const allFiles = []
      const errors = []

      for (const inputPath of paths) {
        const cleanPath = inputPath.trim()
        if (!cleanPath) continue

        const resolvedPath = path.resolve(cleanPath)

        // Security check
        if (!isPathAllowed(resolvedPath)) {
          errors.push({ path: cleanPath, error: 'Path not allowed' })
          continue
        }

        try {
          const stats = await fs.stat(resolvedPath)

          if (stats.isDirectory()) {
            const files = await getFilesRecursively(resolvedPath)
            allFiles.push(...files.map(f => ({
              ...f,
              sourceDir: cleanPath
            })))
          } else if (stats.isFile() && isAllowedExtension(resolvedPath)) {
            if (stats.size <= 100 * 1024) {
              allFiles.push({
                path: path.basename(resolvedPath),
                fullPath: resolvedPath,
                size: stats.size,
                sourceDir: path.dirname(cleanPath)
              })
            }
          }
        } catch (err) {
          errors.push({ path: cleanPath, error: err.code === 'ENOENT' ? 'Path not found' : err.message })
        }
      }

      // Group files by directory for module suggestions
      const directoryGroups = {}
      for (const file of allFiles) {
        const dir = path.dirname(file.path) || '(root)'
        if (!directoryGroups[dir]) {
          directoryGroups[dir] = []
        }
        directoryGroups[dir].push(file)
      }

      const suggestedModules = Object.entries(directoryGroups).map(([directory, files]) => ({
        name: directory === '(root)' ? 'Root' : path.basename(directory),
        directory,
        type: 'module',
        files: files.map(f => ({ path: f.path, size: f.size })),
        fileCount: files.length
      }))

      return NextResponse.json({
        totalFiles: allFiles.length,
        files: allFiles,
        suggestedModules,
        errors: errors.length > 0 ? errors : undefined
      })
    }

    // Action: import - Read file contents
    if (action === 'import') {
      if (!selectedFiles || selectedFiles.length === 0) {
        return NextResponse.json(
          { error: 'No files selected for import' },
          { status: 400 }
        )
      }

      const files = []

      for (const file of selectedFiles) {
        if (!isPathAllowed(file.fullPath)) {
          continue
        }

        try {
          const content = await fs.readFile(file.fullPath, 'utf-8')
          files.push({
            file_path: file.path,
            content,
            language: detectLanguage(file.path)
          })
        } catch (err) {
          console.error(`Failed to read file ${file.fullPath}:`, err)
        }
      }

      return NextResponse.json({
        files,
        count: files.length
      })
    }

    return NextResponse.json(
      { error: 'Invalid action. Use "analyze" or "import".' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Local import error:', error)
    return NextResponse.json(
      { error: 'Failed to process local import' },
      { status: 500 }
    )
  }
}
