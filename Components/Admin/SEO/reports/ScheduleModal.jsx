'use client';

import { useState } from 'react';
import { Alert, Button, ConfirmButton, Field, Modal, inputClass } from '../ui';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function ScheduleModal({ site, schedule, userEmail, onSave, onDelete, onClose }) {
  const [frequency, setFrequency] = useState(schedule?.frequency || 'weekly');
  const [dayOfWeek, setDayOfWeek] = useState(schedule?.day_of_week ?? 1);
  const [dayOfMonth, setDayOfMonth] = useState(schedule?.day_of_month ?? 1);
  const [timeUtc, setTimeUtc] = useState(schedule?.time_utc?.slice(0, 5) || '09:00');
  const [recipients, setRecipients] = useState(schedule?.recipients?.join(', ') || userEmail || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e?.preventDefault();
    setSaving(true);
    setError(null);
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
          recipients: recipients.split(',').map(r => r.trim()).filter(Boolean),
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      onSave(data.schedule);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    try {
      await fetch(`/api/seo/schedules?id=${schedule.id}`, { method: 'DELETE' });
      onDelete();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <Modal
      title="Report schedule"
      description="Reports are generated and emailed automatically."
      onClose={onClose}
      footer={
        <>
          {schedule && <ConfirmButton onConfirm={handleDelete} confirmLabel="Confirm delete" className="mr-auto">Delete schedule</ConfirmButton>}
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={handleSubmit} loading={saving}>Save schedule</Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <Alert tone="bad">{error}</Alert>}
        <Field label="Frequency" htmlFor="sch-frequency">
          <select id="sch-frequency" value={frequency} onChange={e => setFrequency(e.target.value)} className={inputClass}>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </Field>
        {frequency === 'weekly' && (
          <Field label="Day of the week" htmlFor="sch-dow">
            <select id="sch-dow" value={dayOfWeek} onChange={e => setDayOfWeek(parseInt(e.target.value, 10))} className={inputClass}>
              {DAYS.map((d, i) => <option key={d} value={i}>{d}</option>)}
            </select>
          </Field>
        )}
        {frequency === 'monthly' && (
          <Field label="Day of the month" htmlFor="sch-dom" hint="Capped at the 28th so it runs every month.">
            <select id="sch-dom" value={dayOfMonth} onChange={e => setDayOfMonth(parseInt(e.target.value, 10))} className={inputClass}>
              {Array.from({ length: 28 }, (_, i) => <option key={i + 1} value={i + 1}>{i + 1}</option>)}
            </select>
          </Field>
        )}
        <Field label="Time (UTC)" htmlFor="sch-time">
          <input id="sch-time" type="time" value={timeUtc} onChange={e => setTimeUtc(e.target.value)} className={inputClass} />
        </Field>
        <Field label="Recipients" htmlFor="sch-to" hint="Separate addresses with commas.">
          <input id="sch-to" type="text" value={recipients} onChange={e => setRecipients(e.target.value)} placeholder="client@example.com" className={inputClass} />
        </Field>
      </form>
    </Modal>
  );
}
