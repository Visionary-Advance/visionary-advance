'use client';

import { useState, useEffect } from 'react';

const priorityColors = {
  high: 'border-red-500 bg-red-500/10',
  medium: 'border-yellow-500 bg-yellow-500/10',
  low: 'border-blue-500 bg-blue-500/10'
};

const priorityLabels = {
  high: { text: 'High', color: 'bg-red-500' },
  medium: { text: 'Medium', color: 'bg-yellow-500' },
  low: { text: 'Low', color: 'bg-blue-500' }
};

const categoryColors = {
  technical: 'text-purple-400',
  content: 'text-green-400',
  'on-page': 'text-blue-400',
  'off-page': 'text-orange-400',
  analytics: 'text-teal-400'
};

const effortLabels = {
  small: { text: 'Quick', color: 'bg-green-600' },
  medium: { text: 'Medium', color: 'bg-yellow-600' },
  large: { text: 'Large', color: 'bg-red-600' }
};

const statusConfig = {
  pending: { label: 'To Do', icon: '○', color: 'text-gray-400' },
  in_progress: { label: 'In Progress', icon: '◐', color: 'text-yellow-400' },
  completed: { label: 'Done', icon: '●', color: 'text-green-400' }
};

const statusCycle = { pending: 'in_progress', in_progress: 'completed', completed: 'pending' };

export default function SEOPlanView({ site }) {
  const [plans, setPlans] = useState([]);
  const [activePlan, setActivePlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [filter, setFilter] = useState('all');
  const [expandedTask, setExpandedTask] = useState(null);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    if (!site?.id) return;
    fetchPlans();
  }, [site?.id]);

  async function fetchPlans() {
    setLoading(true);
    try {
      const [activeRes, allRes] = await Promise.all([
        fetch(`/api/seo/plans?siteId=${site.id}&activeOnly=true`),
        fetch(`/api/seo/plans?siteId=${site.id}`)
      ]);
      const activeData = await activeRes.json();
      const allData = await allRes.json();
      setActivePlan(activeData.plan || null);
      setPlans(allData.plans || []);
    } catch (err) {
      console.error('Error fetching plans:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleGeneratePlan() {
    setGenerating(true);
    try {
      // Sync latest data first
      await fetch('/api/seo/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ siteId: site.id, type: 'analytics', days: 60 })
      });

      const res = await fetch('/api/seo/plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ siteId: site.id })
      });

      const data = await res.json();
      if (data.error) {
        alert('Failed to generate plan: ' + data.error);
        return;
      }

      setActivePlan(data.plan);
      await fetchPlans();
    } catch (err) {
      alert('Failed to generate plan: ' + err.message);
    } finally {
      setGenerating(false);
    }
  }

  async function handleToggleTask(task) {
    const newStatus = statusCycle[task.status];
    try {
      const res = await fetch('/api/seo/plans/tasks', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId: task.id, status: newStatus })
      });

      const data = await res.json();
      if (data.error) return;

      // Update local state
      setActivePlan(prev => {
        if (!prev) return prev;
        const updatedTasks = prev.tasks.map(t =>
          t.id === task.id ? { ...t, status: newStatus, completed_at: data.task.completed_at } : t
        );
        return { ...prev, tasks: updatedTasks };
      });

      // If plan got auto-archived (all tasks complete), refresh
      if (newStatus === 'completed') {
        const checkRes = await fetch(`/api/seo/plans?siteId=${site.id}&activeOnly=true`);
        const checkData = await checkRes.json();
        if (!checkData.plan) {
          setActivePlan(null);
          fetchPlans();
        }
      }
    } catch (err) {
      console.error('Error updating task:', err);
    }
  }

  async function handleSaveNotes(taskId, notes) {
    try {
      await fetch('/api/seo/plans/tasks', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId, notes })
      });

      setActivePlan(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          tasks: prev.tasks.map(t => t.id === taskId ? { ...t, notes } : t)
        };
      });
    } catch (err) {
      console.error('Error saving notes:', err);
    }
  }

  if (!site) return null;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-400"></div>
      </div>
    );
  }

  // No active plan
  if (!activePlan) {
    return (
      <div className="space-y-6">
        <div className="bg-[#0a0a0a] rounded-lg border border-[#262626] p-8 text-center">
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
          <h3 className="text-lg font-semibold text-white mb-2">No Active SEO Plan</h3>
          <p className="text-gray-400 mb-6 max-w-md mx-auto">
            Generate an AI-powered SEO plan based on your latest Search Console data. The plan includes prioritized tasks with specific action items.
          </p>
          <button
            onClick={handleGeneratePlan}
            disabled={generating}
            className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2.5 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2 mx-auto"
          >
            {generating ? (
              <>
                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                Syncing & Generating...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Generate Plan
              </>
            )}
          </button>
        </div>

        {/* Plan History */}
        {plans.length > 0 && (
          <PlanHistory plans={plans.filter(p => p.status === 'archived')} />
        )}
      </div>
    );
  }

  // Active plan view
  const tasks = activePlan.tasks || [];
  const completedCount = tasks.filter(t => t.status === 'completed').length;
  const progressPct = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  const filteredTasks = filter === 'all'
    ? tasks
    : tasks.filter(t => t.status === filter);

  // Group by priority for display
  const highTasks = filteredTasks.filter(t => t.priority === 'high');
  const mediumTasks = filteredTasks.filter(t => t.priority === 'medium');
  const lowTasks = filteredTasks.filter(t => t.priority === 'low');

  return (
    <div className="space-y-6">
      {/* Plan Header */}
      <div className="bg-[#0a0a0a] rounded-lg border border-[#262626] p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-white">{activePlan.month} SEO Plan</h3>
            <p className="text-gray-400 text-sm mt-1">
              Created {new Date(activePlan.created_at).toLocaleDateString()}
            </p>
          </div>
          <button
            onClick={handleGeneratePlan}
            disabled={generating}
            className="text-sm bg-[#171717] hover:bg-[#262626] border border-[#262626] text-white px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {generating ? (
              <>
                <span className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></span>
                Generating...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Regenerate
              </>
            )}
          </button>
        </div>

        {/* Summary */}
        {activePlan.summary && (
          <p className="text-gray-300 text-sm mb-4">{activePlan.summary}</p>
        )}

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-gray-400">Progress</span>
            <span className="text-white font-medium">{completedCount}/{tasks.length} tasks ({progressPct}%)</span>
          </div>
          <div className="w-full bg-[#262626] rounded-full h-2">
            <div
              className="bg-teal-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* Goals */}
        {activePlan.goals?.length > 0 && (
          <div>
            <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Goals</h4>
            <ul className="space-y-1">
              {activePlan.goals.map((goal, idx) => (
                <li key={idx} className="text-gray-300 text-sm flex items-start gap-2">
                  <span className="text-teal-400 mt-0.5 shrink-0">-</span>
                  {goal}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-2">
        {['all', 'pending', 'in_progress', 'completed'].map(f => {
          const count = f === 'all' ? tasks.length : tasks.filter(t => t.status === f).length;
          const label = f === 'all' ? 'All' : statusConfig[f]?.label || f;
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`text-sm px-3 py-1.5 rounded-lg transition-colors ${
                filter === f
                  ? 'bg-teal-500/20 text-teal-400 border border-teal-500/50'
                  : 'bg-[#171717] text-gray-400 border border-[#262626] hover:border-gray-500'
              }`}
            >
              {label} ({count})
            </button>
          );
        })}
      </div>

      {/* Task Groups */}
      {filteredTasks.length === 0 ? (
        <div className="bg-[#0a0a0a] rounded-lg border border-[#262626] p-8 text-center text-gray-400">
          No tasks match this filter.
        </div>
      ) : (
        <div className="space-y-4">
          <TaskGroup
            label="High Priority"
            tasks={highTasks}
            onToggle={handleToggleTask}
            expandedTask={expandedTask}
            onExpand={setExpandedTask}
            onSaveNotes={handleSaveNotes}
          />
          <TaskGroup
            label="Medium Priority"
            tasks={mediumTasks}
            onToggle={handleToggleTask}
            expandedTask={expandedTask}
            onExpand={setExpandedTask}
            onSaveNotes={handleSaveNotes}
          />
          <TaskGroup
            label="Low Priority"
            tasks={lowTasks}
            onToggle={handleToggleTask}
            expandedTask={expandedTask}
            onExpand={setExpandedTask}
            onSaveNotes={handleSaveNotes}
          />
        </div>
      )}

      {/* Metrics to Track */}
      {activePlan.metrics_to_track?.length > 0 && (
        <div className="bg-[#0a0a0a] rounded-lg border border-[#262626] p-6">
          <h4 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-3">Metrics to Track</h4>
          <div className="overflow-hidden rounded-lg border border-[#262626]">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#171717]">
                  <th className="px-4 py-2 text-left text-gray-400">Metric</th>
                  <th className="px-4 py-2 text-center text-gray-400">Current</th>
                  <th className="px-4 py-2 text-center text-gray-400">Target</th>
                </tr>
              </thead>
              <tbody>
                {activePlan.metrics_to_track.map((m, idx) => (
                  <tr key={idx} className="border-t border-[#262626]">
                    <td className="px-4 py-2 text-gray-300">{m.metric}</td>
                    <td className="px-4 py-2 text-center text-gray-400">{m.current_value}</td>
                    <td className="px-4 py-2 text-center text-teal-400 font-medium">{m.target_value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Plan History */}
      {plans.filter(p => p.status === 'archived').length > 0 && (
        <div>
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-3"
          >
            <svg className={`w-4 h-4 transition-transform ${showHistory ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            Plan History ({plans.filter(p => p.status === 'archived').length})
          </button>
          {showHistory && (
            <PlanHistory plans={plans.filter(p => p.status === 'archived')} />
          )}
        </div>
      )}
    </div>
  );
}

function TaskGroup({ label, tasks, onToggle, expandedTask, onExpand, onSaveNotes }) {
  if (tasks.length === 0) return null;

  return (
    <div>
      <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">{label}</h4>
      <div className="space-y-2">
        {tasks.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            onToggle={onToggle}
            isExpanded={expandedTask === task.id}
            onExpand={onExpand}
            onSaveNotes={onSaveNotes}
          />
        ))}
      </div>
    </div>
  );
}

function TaskCard({ task, onToggle, isExpanded, onExpand, onSaveNotes }) {
  const [notes, setNotes] = useState(task.notes || '');
  const [saving, setSaving] = useState(false);
  const status = statusConfig[task.status] || statusConfig.pending;

  async function handleSave() {
    setSaving(true);
    await onSaveNotes(task.id, notes);
    setSaving(false);
  }

  return (
    <div className={`rounded-lg border-l-4 ${priorityColors[task.priority] || 'border-gray-500 bg-gray-500/10'} bg-[#0a0a0a] border border-[#262626] overflow-hidden`}
      style={{ borderLeftColor: task.priority === 'high' ? '#ef4444' : task.priority === 'medium' ? '#eab308' : '#3b82f6' }}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Status Toggle */}
          <button
            onClick={() => onToggle(task)}
            className={`mt-0.5 text-lg shrink-0 ${status.color} hover:opacity-80 transition-opacity`}
            title={`Click to change status (${status.label})`}
          >
            {status.icon}
          </button>

          <div className="flex-1 min-w-0">
            {/* Title + Meta */}
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h5 className={`font-medium ${task.status === 'completed' ? 'text-gray-500 line-through' : 'text-white'}`}>
                {task.title}
              </h5>
              <span className={`text-xs ${categoryColors[task.category] || 'text-gray-400'}`}>
                {task.category}
              </span>
              {task.estimated_effort && (
                <span className={`text-xs text-white px-1.5 py-0.5 rounded ${effortLabels[task.estimated_effort]?.color || 'bg-gray-600'}`}>
                  {effortLabels[task.estimated_effort]?.text || task.estimated_effort}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-400 text-sm">{task.description}</p>

            {/* Expand/Collapse */}
            <button
              onClick={() => onExpand(isExpanded ? null : task.id)}
              className="text-xs text-gray-500 hover:text-gray-300 mt-2 transition-colors"
            >
              {isExpanded ? 'Collapse' : 'Details & Notes'}
            </button>
          </div>
        </div>
      </div>

      {/* Expanded Detail */}
      {isExpanded && (
        <div className="px-4 pb-4 pt-0 ml-9 border-t border-[#262626] mt-2 pt-3">
          {/* Files */}
          {task.files_to_modify?.length > 0 && (
            <div className="mb-3">
              <p className="text-gray-500 text-xs mb-1">Files to modify:</p>
              <div className="flex flex-wrap gap-1">
                {task.files_to_modify.map((f, i) => (
                  <span key={i} className="text-xs bg-[#171717] text-gray-300 px-2 py-0.5 rounded">{f}</span>
                ))}
              </div>
            </div>
          )}

          {/* Acceptance Criteria */}
          {task.acceptance_criteria?.length > 0 && (
            <div className="mb-3">
              <p className="text-gray-500 text-xs mb-1">Acceptance Criteria:</p>
              <ul className="space-y-1">
                {task.acceptance_criteria.map((c, i) => (
                  <li key={i} className="text-gray-300 text-sm flex items-start gap-2">
                    <span className="text-gray-500">-</span>
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Notes */}
          <div>
            <p className="text-gray-500 text-xs mb-1">Notes:</p>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes..."
              rows={3}
              className="w-full bg-[#171717] border border-[#262626] rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 resize-none focus:outline-none focus:border-teal-500"
            />
            {notes !== (task.notes || '') && (
              <button
                onClick={handleSave}
                disabled={saving}
                className="mt-1 text-xs bg-teal-500 hover:bg-teal-600 text-white px-3 py-1 rounded transition-colors disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Notes'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function PlanHistory({ plans }) {
  if (plans.length === 0) return null;

  return (
    <div className="space-y-2">
      {plans.map(plan => {
        const tasks = plan.tasks || [];
        const completed = tasks.filter(t => t.status === 'completed').length;
        return (
          <div key={plan.id} className="bg-[#0a0a0a] rounded-lg border border-[#262626] p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-white font-medium">{plan.month}</h4>
                <p className="text-gray-500 text-sm">
                  {completed}/{tasks.length} tasks completed
                </p>
              </div>
              <span className="text-xs bg-[#171717] text-gray-400 px-2 py-1 rounded">
                Archived
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
