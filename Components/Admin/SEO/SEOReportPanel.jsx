'use client';

import { useState, useEffect } from 'react';

export default function SEOReportPanel({ site, userEmail }) {
  const [reports, setReports] = useState([]);
  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);

  // Fetch reports and schedule
  useEffect(() => {
    if (!site?.id) return;

    async function fetchData() {
      setLoading(true);
      try {
        const [reportsRes, scheduleRes] = await Promise.all([
          fetch(`/api/seo/reports?siteId=${site.id}`),
          fetch(`/api/seo/schedules?siteId=${site.id}`)
        ]);

        const reportsData = await reportsRes.json();
        const scheduleData = await scheduleRes.json();

        setReports(reportsData.reports || []);
        setSchedule(scheduleData.schedule);
      } catch (err) {
        console.error('Error fetching reports:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [site?.id]);

  // Generate new report
  async function handleGenerateReport() {
    setGenerating(true);
    try {
      // First sync the last 2 months of data
      await fetch('/api/seo/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ siteId: site.id, type: 'analytics', days: 60 })
      });

      // Then generate the report
      const res = await fetch('/api/seo/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ siteId: site.id })
      });

      const data = await res.json();
      if (data.error) {
        alert('Failed to generate report: ' + data.error);
        return;
      }

      setReports([data.report, ...reports]);
      setSelectedReport(data.report);
    } catch (err) {
      alert('Failed to generate report: ' + err.message);
    } finally {
      setGenerating(false);
    }
  }

  if (!site) return null;

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <h3 className="text-lg font-semibold text-white">SEO Reports</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setShowScheduleModal(true)}
            className="text-sm bg-gray-700 hover:bg-gray-600 text-white px-3 py-1.5 rounded transition-colors flex items-center gap-1"
          >
            <ClockIcon className="w-4 h-4" />
            {schedule ? 'Edit Schedule' : 'Schedule'}
          </button>
          <button
            onClick={handleGenerateReport}
            disabled={generating}
            className="text-sm bg-teal-500 hover:bg-teal-600 text-white px-3 py-1.5 rounded transition-colors flex items-center gap-1 disabled:opacity-50"
          >
            {generating ? (
              <>
                <span className="animate-spin">⏳</span>
                Syncing & Generating...
              </>
            ) : (
              <>
                <DocumentIcon className="w-4 h-4" />
                Generate Monthly Report
              </>
            )}
          </button>
        </div>
      </div>

      {/* Schedule Info */}
      {schedule && (
        <div className="px-4 py-3 bg-gray-700/50 border-b border-gray-700 flex items-center gap-2 text-sm">
          <ClockIcon className="w-4 h-4 text-teal-400" />
          <span className="text-gray-300">
            {schedule.frequency.charAt(0).toUpperCase() + schedule.frequency.slice(1)} reports to{' '}
            {schedule.recipients?.join(', ')}
          </span>
          {schedule.next_run_at && (
            <span className="text-gray-500 ml-auto">
              Next: {new Date(schedule.next_run_at).toLocaleDateString()}
            </span>
          )}
        </div>
      )}

      {/* Content */}
      <div className="p-4">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-400 mx-auto"></div>
          </div>
        ) : selectedReport ? (
          <ReportView
            report={selectedReport}
            site={site}
            onBack={() => setSelectedReport(null)}
            onSend={() => setShowSendModal(true)}
            onDelete={(deletedId) => {
              setReports(reports.filter(r => r.id !== deletedId));
              setSelectedReport(null);
            }}
          />
        ) : reports.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <DocumentIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No reports generated yet.</p>
            <p className="text-sm mt-1">Generate your first report to see actionable insights.</p>
          </div>
        ) : (
          <ReportList
            reports={reports}
            onSelect={setSelectedReport}
          />
        )}
      </div>

      {/* Schedule Modal */}
      {showScheduleModal && (
        <ScheduleModal
          site={site}
          schedule={schedule}
          userEmail={userEmail}
          onSave={(newSchedule) => {
            setSchedule(newSchedule);
            setShowScheduleModal(false);
          }}
          onDelete={() => {
            setSchedule(null);
            setShowScheduleModal(false);
          }}
          onClose={() => setShowScheduleModal(false)}
        />
      )}

      {/* Send Modal */}
      {showSendModal && selectedReport && (
        <SendReportModal
          report={selectedReport}
          userEmail={userEmail}
          onClose={() => setShowSendModal(false)}
          onSent={() => {
            setShowSendModal(false);
            // Refresh reports to update sent status
            fetch(`/api/seo/reports?siteId=${site.id}`)
              .then(res => res.json())
              .then(data => setReports(data.reports || []));
          }}
        />
      )}
    </div>
  );
}

function ReportList({ reports, onSelect }) {
  return (
    <div className="space-y-2">
      {reports.map(report => {
        const currentMonth = report.month_comparison?.currentMonth?.name;
        const previousMonth = report.month_comparison?.previousMonth?.name;
        const title = currentMonth && previousMonth
          ? `${currentMonth} vs ${previousMonth}`
          : formatDateRange(report.start_date, report.end_date);

        return (
          <button
            key={report.id}
            onClick={() => onSelect(report)}
            className="w-full text-left p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">{title}</p>
                <p className="text-gray-400 text-sm">
                  {report.total_clicks?.toLocaleString()} clicks • {report.recommendations?.length || 0} recommendations
                </p>
              </div>
              <div className="flex items-center gap-2">
                {report.status === 'sent' && (
                  <span className="text-xs bg-green-900/50 text-green-300 px-2 py-0.5 rounded">Sent</span>
                )}
                <ChevronRightIcon className="w-5 h-5 text-gray-500" />
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}

function ReportView({ report, site, onBack, onSend, onDelete }) {
  const [deleting, setDeleting] = useState(false);
  const recommendations = report.recommendations || [];
  const monthComparison = report.month_comparison;
  const currentMonth = monthComparison?.currentMonth;
  const previousMonth = monthComparison?.previousMonth;

  const priorityColors = {
    high: 'border-red-500 bg-red-500/10',
    medium: 'border-yellow-500 bg-yellow-500/10',
    info: 'border-green-500 bg-green-500/10'
  };

  const priorityLabels = {
    high: { text: 'High Priority', color: 'bg-red-500' },
    medium: { text: 'Medium Priority', color: 'bg-yellow-500' },
    info: { text: 'Good News', color: 'bg-green-500' }
  };

  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this report? This cannot be undone.')) {
      return;
    }

    setDeleting(true);
    try {
      const res = await fetch(`/api/seo/reports?reportId=${report.id}`, {
        method: 'DELETE'
      });

      const data = await res.json();
      if (data.error) {
        alert('Failed to delete report: ' + data.error);
        return;
      }

      onDelete(report.id);
    } catch (err) {
      alert('Failed to delete report: ' + err.message);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <ChevronLeftIcon className="w-5 h-5" />
          Back to Reports
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="flex items-center gap-2 text-sm bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300 px-3 py-1.5 rounded transition-colors disabled:opacity-50"
          >
            <TrashIcon className="w-4 h-4" />
            {deleting ? 'Deleting...' : 'Delete'}
          </button>
          <button
            onClick={onSend}
            className="flex items-center gap-2 text-sm bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded transition-colors"
          >
            <EmailIcon className="w-4 h-4" />
            Send Report
          </button>
        </div>
      </div>

      {/* Report Period */}
      <div className="mb-6">
        <h4 className="text-xl font-bold text-white">
          {currentMonth?.name || 'Current Month'} vs {previousMonth?.name || 'Previous Month'}
        </h4>
        <p className="text-gray-400 text-sm">
          Generated {new Date(report.created_at).toLocaleString()}
        </p>
      </div>

      {/* AI Summary */}
      {report.ai_summary && (
        <div className="bg-teal-900/30 border-l-4 border-teal-500 p-4 rounded-r-lg mb-6">
          <p className="text-teal-100 italic">"{report.ai_summary}"</p>
        </div>
      )}

      {/* Month Comparison Table */}
      <div className="bg-gray-700 rounded-lg overflow-hidden mb-6">
        <table className="w-full">
          <thead>
            <tr>
              <th className="px-4 py-3 text-left text-gray-400 text-sm font-medium">Metric</th>
              <th className="px-4 py-3 text-center bg-teal-600 text-white text-sm font-medium">
                {currentMonth?.name || 'Current'}
              </th>
              <th className="px-4 py-3 text-center bg-gray-600 text-gray-200 text-sm font-medium">
                {previousMonth?.name || 'Previous'}
              </th>
              <th className="px-4 py-3 text-center text-gray-400 text-sm font-medium">Change</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-gray-600">
              <td className="px-4 py-3 text-gray-300">Clicks</td>
              <td className="px-4 py-3 text-center text-white font-bold text-lg">
                {currentMonth?.metrics?.totalClicks?.toLocaleString() || 0}
              </td>
              <td className="px-4 py-3 text-center text-gray-400">
                {previousMonth?.metrics?.totalClicks?.toLocaleString() || 0}
              </td>
              <td className="px-4 py-3 text-center">
                <ChangeIndicator value={report.clicks_change} />
              </td>
            </tr>
            <tr className="border-t border-gray-600">
              <td className="px-4 py-3 text-gray-300">Impressions</td>
              <td className="px-4 py-3 text-center text-white font-bold text-lg">
                {currentMonth?.metrics?.totalImpressions?.toLocaleString() || 0}
              </td>
              <td className="px-4 py-3 text-center text-gray-400">
                {previousMonth?.metrics?.totalImpressions?.toLocaleString() || 0}
              </td>
              <td className="px-4 py-3 text-center">
                <ChangeIndicator value={report.impressions_change} />
              </td>
            </tr>
            <tr className="border-t border-gray-600">
              <td className="px-4 py-3 text-gray-300">CTR</td>
              <td className="px-4 py-3 text-center text-white font-bold text-lg">
                {((currentMonth?.metrics?.avgCtr || 0) * 100).toFixed(2)}%
              </td>
              <td className="px-4 py-3 text-center text-gray-400">
                {((previousMonth?.metrics?.avgCtr || 0) * 100).toFixed(2)}%
              </td>
              <td className="px-4 py-3 text-center">
                <ChangeIndicator value={report.ctr_change ? report.ctr_change * 100 : null} suffix="pts" />
              </td>
            </tr>
            <tr className="border-t border-gray-600">
              <td className="px-4 py-3 text-gray-300">Avg Position</td>
              <td className="px-4 py-3 text-center text-white font-bold text-lg">
                {(currentMonth?.metrics?.avgPosition || 0).toFixed(1)}
              </td>
              <td className="px-4 py-3 text-center text-gray-400">
                {(previousMonth?.metrics?.avgPosition || 0).toFixed(1)}
              </td>
              <td className="px-4 py-3 text-center">
                <ChangeIndicator value={report.position_change} inverted />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Recommendations */}
      <h4 className="text-lg font-semibold text-white mb-4">
        AI-Powered Recommendations ({recommendations.length})
      </h4>

      {recommendations.length === 0 ? (
        <p className="text-gray-400">No specific recommendations at this time.</p>
      ) : (
        <div className="space-y-4">
          {recommendations.map((rec, idx) => (
            <div
              key={rec.id || idx}
              className={`p-4 rounded-lg border-l-4 ${priorityColors[rec.priority] || 'border-gray-500'}`}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-xs text-white px-2 py-0.5 rounded ${priorityLabels[rec.priority]?.color || 'bg-gray-500'}`}>
                  {priorityLabels[rec.priority]?.text || rec.priority}
                </span>
                <span className="text-gray-500 text-xs">{rec.category}</span>
              </div>
              <h5 className="text-white font-medium mb-2">{rec.title}</h5>
              <p className="text-gray-300 text-sm mb-3">{rec.description}</p>
              <p className="text-teal-400 text-xs mb-3">💡 {rec.impact}</p>

              {rec.actions && rec.actions.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-600">
                  <p className="text-gray-400 text-xs font-medium mb-2">ACTION ITEMS:</p>
                  <ul className="space-y-1">
                    {rec.actions.slice(0, 5).map((action, i) => (
                      <li key={i} className="text-gray-300 text-sm flex items-start gap-2">
                        <span className="text-teal-400 mt-0.5">•</span>
                        {action.suggestion}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ChangeIndicator({ value, suffix = '%', inverted = false }) {
  if (value === null || value === undefined) {
    return <span className="text-gray-500">—</span>;
  }

  const isPositive = inverted ? value > 0 : value > 0;
  const color = isPositive ? 'text-green-400' : value < 0 ? 'text-red-400' : 'text-gray-500';
  const arrow = value > 0 ? '↑' : value < 0 ? '↓' : '';

  return (
    <span className={`font-semibold ${color}`}>
      {arrow} {Math.abs(value).toFixed(1)}{suffix}
    </span>
  );
}

function MetricCard({ label, value, change, isPercentagePoints, invertColors }) {
  let changeColor = 'text-gray-500';
  let arrow = '';

  if (change !== null && change !== undefined) {
    const isPositive = invertColors ? change > 0 : change > 0;
    changeColor = isPositive ? 'text-green-400' : change < 0 ? 'text-red-400' : 'text-gray-500';
    arrow = change > 0 ? '↑' : change < 0 ? '↓' : '';
  }

  return (
    <div className="bg-gray-700 rounded-lg p-3">
      <p className="text-gray-400 text-xs">{label}</p>
      <p className="text-white text-xl font-bold">{value}</p>
      {change !== null && change !== undefined && (
        <p className={`text-xs ${changeColor}`}>
          {arrow} {Math.abs(change).toFixed(1)}{isPercentagePoints ? 'pts' : '%'}
        </p>
      )}
    </div>
  );
}

function ScheduleModal({ site, schedule, userEmail, onSave, onDelete, onClose }) {
  const [frequency, setFrequency] = useState(schedule?.frequency || 'weekly');
  const [dayOfWeek, setDayOfWeek] = useState(schedule?.day_of_week ?? 1);
  const [dayOfMonth, setDayOfMonth] = useState(schedule?.day_of_month ?? 1);
  const [timeUtc, setTimeUtc] = useState(schedule?.time_utc?.slice(0, 5) || '09:00');
  const [recipients, setRecipients] = useState(schedule?.recipients?.join(', ') || userEmail || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const recipientList = recipients.split(',').map(e => e.trim()).filter(Boolean);

    try {
      const res = await fetch('/api/seo/schedules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          siteId: site.id,
          frequency,
          dayOfWeek: frequency === 'weekly' ? dayOfWeek : null,
          dayOfMonth: frequency === 'monthly' ? dayOfMonth : null,
          timeUtc,
          recipients: recipientList
        })
      });

      const data = await res.json();
      if (data.error) {
        setError(data.error);
        return;
      }

      onSave(data.schedule);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!schedule?.id) return;
    if (!confirm('Delete this schedule?')) return;

    try {
      await fetch(`/api/seo/schedules?id=${schedule.id}`, { method: 'DELETE' });
      onDelete();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg border border-gray-700 w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h3 className="text-lg font-semibold text-white">Schedule Reports</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {error && (
            <div className="bg-red-900/50 border border-red-700 text-red-200 px-3 py-2 rounded text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Frequency</label>
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>

          {frequency === 'weekly' && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Day of Week</label>
              <select
                value={dayOfWeek}
                onChange={(e) => setDayOfWeek(parseInt(e.target.value))}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white"
              >
                <option value={0}>Sunday</option>
                <option value={1}>Monday</option>
                <option value={2}>Tuesday</option>
                <option value={3}>Wednesday</option>
                <option value={4}>Thursday</option>
                <option value={5}>Friday</option>
                <option value={6}>Saturday</option>
              </select>
            </div>
          )}

          {frequency === 'monthly' && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Day of Month</label>
              <select
                value={dayOfMonth}
                onChange={(e) => setDayOfMonth(parseInt(e.target.value))}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white"
              >
                {[...Array(28)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>{i + 1}</option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Time (UTC)</label>
            <input
              type="time"
              value={timeUtc}
              onChange={(e) => setTimeUtc(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Recipients (comma-separated)</label>
            <input
              type="text"
              value={recipients}
              onChange={(e) => setRecipients(e.target.value)}
              placeholder="email@example.com, another@example.com"
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white"
            />
          </div>

          <div className="flex gap-3 pt-2">
            {schedule && (
              <button
                type="button"
                onClick={handleDelete}
                className="px-4 py-2 text-red-400 hover:text-red-300 transition-colors"
              >
                Delete
              </button>
            )}
            <div className="flex-1"></div>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Schedule'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function SendReportModal({ report, userEmail, onClose, onSent }) {
  const [recipients, setRecipients] = useState(userEmail || '');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);

  async function handleSend() {
    setSending(true);
    setError(null);

    const recipientList = recipients.split(',').map(e => e.trim()).filter(Boolean);

    try {
      const res = await fetch('/api/seo/reports/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reportId: report.id,
          recipients: recipientList
        })
      });

      const data = await res.json();
      if (data.error) {
        setError(data.error);
        return;
      }

      alert('Report sent successfully!');
      onSent();
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg border border-gray-700 w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h3 className="text-lg font-semibold text-white">Send Report</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {error && (
            <div className="bg-red-900/50 border border-red-700 text-red-200 px-3 py-2 rounded text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Recipients (comma-separated)
            </label>
            <input
              type="text"
              value={recipients}
              onChange={(e) => setRecipients(e.target.value)}
              placeholder="email@example.com"
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSend}
              disabled={sending || !recipients.trim()}
              className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              {sending ? 'Sending...' : 'Send Email'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper functions
function formatDateRange(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const options = { month: 'short', day: 'numeric' };
  return `${start.toLocaleDateString('en-US', options)} - ${end.toLocaleDateString('en-US', options)}`;
}

// Icons
function ClockIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function DocumentIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}

function ChevronRightIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  );
}

function ChevronLeftIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
  );
}

function EmailIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
}

function CloseIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function TrashIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  );
}
