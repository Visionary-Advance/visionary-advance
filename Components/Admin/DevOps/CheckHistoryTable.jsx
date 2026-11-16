'use client'

import { EmptyState, Table, Td, Th, cx } from '@/Components/Admin/ui'
import { Activity } from 'lucide-react'
import StatusBadge, { checkStatus } from './StatusBadge'
import { fmtDateTime } from './format'

export default function CheckHistoryTable({ checks }) {
  if (!checks?.length) {
    return <EmptyState icon={Activity} title="No checks yet" description="Run a check or wait for the next scheduled one." />
  }

  return (
    <Table>
      <thead>
        <tr>
          <Th>Status</Th>
          <Th>Time</Th>
          <Th align="right">Response</Th>
          <Th align="right" className="hidden sm:table-cell">HTTP</Th>
          <Th className="hidden md:table-cell">Details</Th>
        </tr>
      </thead>
      <tbody className="divide-y divide-adm-border">
        {checks.map(check => {
          const details = [
            check.database_status && `DB ${check.database_status}`,
            check.memory_usage_mb && `${check.memory_usage_mb}MB`,
            check.version && `v${check.version}`,
            check.error_message,
          ].filter(Boolean).join(' · ')
          return (
            <tr key={check.id}>
              <Td><StatusBadge status={checkStatus(check)} /></Td>
              <Td className="whitespace-nowrap text-adm-muted">{fmtDateTime(check.checked_at)}</Td>
              <Td align="right" numeric className={responseColor(check.response_time_ms)}>
                {check.response_time_ms ? `${check.response_time_ms}ms` : '—'}
              </Td>
              <Td align="right" numeric className="hidden text-adm-muted sm:table-cell">{check.http_status_code || '—'}</Td>
              <Td className="hidden max-w-xs truncate text-adm-subtle md:table-cell" title={details}>{details || '—'}</Td>
            </tr>
          )
        })}
      </tbody>
    </Table>
  )
}

function responseColor(ms) {
  if (!ms) return 'text-adm-subtle'
  return cx(ms < 1000 ? 'text-adm-text' : ms < 3000 ? 'text-adm-warn' : 'text-adm-bad')
}
