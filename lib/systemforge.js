// lib/systemforge.js
// Server-side Supabase operations for SystemForge vault

import { createClient } from '@supabase/supabase-js'

// Lazy-load Supabase client to avoid build-time initialization errors
let supabaseInstance = null

const getSupabase = () => {
  if (!supabaseInstance) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Database credentials not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY')
    }

    supabaseInstance = createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false,
      },
    })
  }
  return supabaseInstance
}

// ============================================
// MODULE OPERATIONS
// ============================================

/**
 * Get all modules with optional filters
 */
export async function getModules({ type, category, search, limit = 50, offset = 0 } = {}) {
  const supabase = getSupabase()

  let query = supabase
    .from('vault_modules')
    .select('*, file_count:vault_files(count)')
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (type) {
    query = query.eq('type', type)
  }
  if (category) {
    query = query.eq('category', category)
  }
  if (search) {
    query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`)
  }

  const { data, error, count } = await query

  if (error) throw error

  // Transform file_count from array to number
  const modules = data?.map(m => ({
    ...m,
    file_count: m.file_count?.[0]?.count || 0
  }))

  return { modules, count }
}

/**
 * Get a single module by ID with files and relationships
 */
export async function getModule(id) {
  const supabase = getSupabase()

  const { data: module, error } = await supabase
    .from('vault_modules')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  if (!module) return null

  // Get files
  const { data: files } = await supabase
    .from('vault_files')
    .select('*')
    .eq('module_id', id)
    .order('file_path')

  // Get relationships (as parent)
  const { data: childRelationships } = await supabase
    .from('vault_relationships')
    .select('*, child:vault_modules!child_id(id, name, type)')
    .eq('parent_id', id)

  // Get relationships (as child)
  const { data: parentRelationships } = await supabase
    .from('vault_relationships')
    .select('*, parent:vault_modules!parent_id(id, name, type)')
    .eq('child_id', id)

  return {
    ...module,
    files: files || [],
    children: childRelationships || [],
    parents: parentRelationships || []
  }
}

/**
 * Create a new module
 */
export async function createModule(data) {
  const supabase = getSupabase()

  const { data: module, error } = await supabase
    .from('vault_modules')
    .insert({
      name: data.name,
      description: data.description,
      type: data.type,
      category: data.category,
      industry_tags: data.industry_tags || [],
      dependencies: data.dependencies || {},
      env_vars: data.env_vars || [],
      config_schema: data.config_schema || {},
      is_preset: data.is_preset || false,
    })
    .select()
    .single()

  if (error) throw error
  return module
}

/**
 * Update a module
 */
export async function updateModule(id, data) {
  const supabase = getSupabase()

  const { data: module, error } = await supabase
    .from('vault_modules')
    .update({
      name: data.name,
      description: data.description,
      type: data.type,
      category: data.category,
      industry_tags: data.industry_tags,
      dependencies: data.dependencies,
      env_vars: data.env_vars,
      config_schema: data.config_schema,
      is_preset: data.is_preset,
    })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return module
}

/**
 * Delete a module
 */
export async function deleteModule(id) {
  const supabase = getSupabase()

  const { error } = await supabase
    .from('vault_modules')
    .delete()
    .eq('id', id)

  if (error) throw error
  return true
}

/**
 * Get distinct categories
 */
export async function getCategories() {
  const supabase = getSupabase()

  const { data, error } = await supabase
    .from('vault_modules')
    .select('category')
    .not('category', 'is', null)

  if (error) throw error

  const categories = [...new Set(data.map(d => d.category))].filter(Boolean).sort()
  return categories
}

/**
 * Get module stats
 */
export async function getModuleStats() {
  const supabase = getSupabase()

  const { data: modules } = await supabase
    .from('vault_modules')
    .select('type')

  const { count: projectCount } = await supabase
    .from('projects')
    .select('*', { count: 'exact', head: true })

  const stats = {
    total: modules?.length || 0,
    modules: modules?.filter(m => m.type === 'module').length || 0,
    components: modules?.filter(m => m.type === 'component').length || 0,
    snippets: modules?.filter(m => m.type === 'snippet').length || 0,
    projects: projectCount || 0
  }

  return stats
}

// ============================================
// FILE OPERATIONS
// ============================================

/**
 * Get files for a module
 */
export async function getModuleFiles(moduleId) {
  const supabase = getSupabase()

  const { data, error } = await supabase
    .from('vault_files')
    .select('*')
    .eq('module_id', moduleId)
    .order('file_path')

  if (error) throw error
  return data || []
}

/**
 * Get a single file
 */
export async function getFile(id) {
  const supabase = getSupabase()

  const { data, error } = await supabase
    .from('vault_files')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

/**
 * Create a file
 */
export async function createFile(data) {
  const supabase = getSupabase()

  const { data: file, error } = await supabase
    .from('vault_files')
    .insert({
      module_id: data.module_id,
      file_path: data.file_path,
      content: data.content,
      language: data.language || detectLanguage(data.file_path),
      description: data.description,
    })
    .select()
    .single()

  if (error) throw error
  return file
}

/**
 * Update a file
 */
export async function updateFile(id, data) {
  const supabase = getSupabase()

  const updateData = {}
  if (data.file_path !== undefined) updateData.file_path = data.file_path
  if (data.content !== undefined) updateData.content = data.content
  if (data.language !== undefined) updateData.language = data.language
  if (data.description !== undefined) updateData.description = data.description

  const { data: file, error } = await supabase
    .from('vault_files')
    .update(updateData)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return file
}

/**
 * Delete a file
 */
export async function deleteFile(id) {
  const supabase = getSupabase()

  const { error } = await supabase
    .from('vault_files')
    .delete()
    .eq('id', id)

  if (error) throw error
  return true
}

/**
 * Bulk create files for a module
 */
export async function createFiles(moduleId, files) {
  const supabase = getSupabase()

  const fileData = files.map(f => ({
    module_id: moduleId,
    file_path: f.file_path,
    content: f.content,
    language: f.language || detectLanguage(f.file_path),
    description: f.description,
  }))

  const { data, error } = await supabase
    .from('vault_files')
    .insert(fileData)
    .select()

  if (error) throw error
  return data
}

// ============================================
// RELATIONSHIP OPERATIONS
// ============================================

/**
 * Create a relationship between modules
 */
export async function createRelationship(parentId, childId, type) {
  const supabase = getSupabase()

  const { data, error } = await supabase
    .from('vault_relationships')
    .insert({
      parent_id: parentId,
      child_id: childId,
      relationship_type: type,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Delete a relationship
 */
export async function deleteRelationship(id) {
  const supabase = getSupabase()

  const { error } = await supabase
    .from('vault_relationships')
    .delete()
    .eq('id', id)

  if (error) throw error
  return true
}

/**
 * Get module relationships
 */
export async function getRelationships(moduleId) {
  const supabase = getSupabase()

  const { data: children } = await supabase
    .from('vault_relationships')
    .select('*, child:vault_modules!child_id(id, name, type)')
    .eq('parent_id', moduleId)

  const { data: parents } = await supabase
    .from('vault_relationships')
    .select('*, parent:vault_modules!parent_id(id, name, type)')
    .eq('child_id', moduleId)

  return {
    children: children || [],
    parents: parents || []
  }
}

// ============================================
// HELPERS
// ============================================

/**
 * Detect language from file extension
 */
function detectLanguage(filePath) {
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

export { detectLanguage }
