// app/api/system-forge/import/github/route.js
import { NextResponse } from 'next/server'
import { parseGitHubUrl, analyzeRepository, importFromGitHub, getRepoInfo } from '@/lib/github-import'

export async function POST(request) {
  try {
    const data = await request.json()
    const { action, url, selectedFiles, branch } = data

    if (!url) {
      return NextResponse.json(
        { error: 'GitHub URL is required' },
        { status: 400 }
      )
    }

    // Parse the URL
    let parsed
    try {
      parsed = parseGitHubUrl(url)
    } catch {
      return NextResponse.json(
        { error: 'Invalid GitHub URL format' },
        { status: 400 }
      )
    }

    const { owner, repo } = parsed

    // Action: analyze - Get repo tree and suggest modules
    if (action === 'analyze') {
      try {
        const [repoInfo, analysis] = await Promise.all([
          getRepoInfo(owner, repo),
          analyzeRepository(owner, repo, branch || 'main')
        ])

        return NextResponse.json({
          repoInfo,
          ...analysis
        })
      } catch (error) {
        if (error.status === 404) {
          return NextResponse.json(
            { error: 'Repository not found. Make sure the URL is correct and you have access.' },
            { status: 404 }
          )
        }
        if (error.status === 401 || error.status === 403) {
          return NextResponse.json(
            { error: 'Authentication failed. Check your GITHUB_TOKEN.' },
            { status: 401 }
          )
        }
        throw error
      }
    }

    // Action: import - Fetch file contents
    if (action === 'import') {
      if (!selectedFiles || selectedFiles.length === 0) {
        return NextResponse.json(
          { error: 'No files selected for import' },
          { status: 400 }
        )
      }

      const files = await importFromGitHub(owner, repo, selectedFiles, branch || 'main')

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
    console.error('GitHub import error:', error)

    // Check for missing token
    if (error.message?.includes('GITHUB_TOKEN')) {
      return NextResponse.json(
        { error: 'GitHub token not configured. Set GITHUB_TOKEN environment variable.' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to process GitHub import' },
      { status: 500 }
    )
  }
}
