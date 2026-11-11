'use client';

import { useState } from 'react';
import { Mail } from 'lucide-react';
import { Alert, Button, Field, Modal, inputClass, useToast } from '../ui';
import { reportPeriod } from '../format';

export default function SendReportModal({ report, userEmail, onClose, onSent }) {
  const notify = useToast();
  const [recipients, setRecipients] = useState(userEmail || '');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);

  async function handleSend(e) {
    e?.preventDefault();
    setSending(true);
    setError(null);
    try {
      const res = await fetch('/api/seo/reports/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reportId: report.id,
          recipients: recipients.split(',').map(r => r.trim()).filter(Boolean),
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      notify('Report sent', 'success');
      onSent();
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  }

  return (
    <Modal
      title="Send report"
      description={reportPeriod(report)}
      onClose={onClose}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button variant="primary" icon={Mail} onClick={handleSend} loading={sending} disabled={!recipients.trim()}>Send email</Button>
        </>
      }
    >
      <form onSubmit={handleSend} className="space-y-4">
        {error && <Alert tone="bad">{error}</Alert>}
        <Field label="Recipients" htmlFor="send-to" hint="Separate addresses with commas.">
          <input id="send-to" type="text" value={recipients} onChange={e => setRecipients(e.target.value)} placeholder="client@example.com" className={inputClass} />
        </Field>
      </form>
    </Modal>
  );
}
