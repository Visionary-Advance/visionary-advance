'use client'

import { useState, useEffect } from 'react'
import TaskItem from './TaskItem'
import TaskForm from './TaskForm'

export default function TaskList({ projectId, onUpdate }) {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchTasks()
  }, [projectId])

  const fetchTasks = async () => {
    try {
      const res = await fetch(`/api/crm/projects/${projectId}/tasks`)
      if (res.ok) {
        const data = await res.json()
        setTasks(data.tasks || [])
      }
    } catch (error) {
      console.error('Failed to fetch tasks:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleTaskCreated = (newTask) => {
    setTasks(prev => [...prev, newTask])
    setShowForm(false)
    onUpdate?.()
  }

  const handleTaskUpdated = (updatedTask) => {
    setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t))
    onUpdate?.()
  }

  const handleTaskDeleted = (taskId) => {
    setTasks(prev => prev.filter(t => t.id !== taskId))
    onUpdate?.()
  }

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true
    if (filter === 'active') return task.status !== 'completed'
    return task.status === filter
  })

  const completedCount = tasks.filter(t => t.status === 'completed').length
  const totalCount = tasks.length
  const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#008070] border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h3 className="text-sm font-medium uppercase tracking-wider text-[#a1a1aa]">
            Tasks
          </h3>
          {totalCount > 0 && (
            <span className="text-xs text-[#a1a1aa]">
              {completedCount}/{totalCount} complete
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="rounded-lg border border-[#262626] bg-[#171717] px-2 py-1 text-xs text-[#a1a1aa] focus:border-[#008070] focus:outline-none"
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          <button
            onClick={() => setShowForm(true)}
            className="rounded-lg bg-[#008070] px-3 py-1 text-xs font-medium text-white hover:bg-[#006b5d]"
          >
            + Add Task
          </button>
        </div>
      </div>

      {/* Progress bar */}
      {totalCount > 0 && (
        <div className="h-1.5 rounded-full bg-[#262626] overflow-hidden">
          <div
            className="h-full rounded-full bg-[#008070] transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Task Form */}
      {showForm && (
        <TaskForm
          projectId={projectId}
          onSave={handleTaskCreated}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* Task List */}
      {filteredTasks.length === 0 ? (
        <div className="text-center py-8 text-[#a1a1aa]">
          {tasks.length === 0 ? 'No tasks yet' : 'No tasks match this filter'}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredTasks.map(task => (
            <TaskItem
              key={task.id}
              task={task}
              projectId={projectId}
              onUpdate={handleTaskUpdated}
              onDelete={handleTaskDeleted}
            />
          ))}
        </div>
      )}
    </div>
  )
}
