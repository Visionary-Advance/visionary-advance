'use client'

// Claude chat list. Start a chat by typing; open one to keep going. Claude replies with an
// answer, a question or a plan; an approved plan becomes a PR in Approvals.

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Archive, Bot, Inbox } from 'lucide-react'
import { Button, Card, EmptyState, PageHeader, PageLoader, useToast } from '@/Components/Admin/ui'
import { announceClaudeChanged, devopsApi } from '@/Components/Admin/DevOps/api'
import { usePullToRefresh } from '@/Components/Admin/PullToRefresh'
import { Composer, ThreadRow } from '@/Components/Admin/DevOps/ClaudeChat'

const SUGGESTIONS = [
  'How does the Pocket sync decide which lead a recording belongs to?',
  'Add a "copy email" button next to the email on the lead detail page',
  'Why might the contact form skip HubSpot?',
]

export default function ClaudeChatsPage() {
  const notify = useToast()
  const router = useRouter()
  const [archived, setArchived] = useState(false)
  const [threads, setThreads] = useState(null)
  const [error, setError] = useState(null)
  const [sending, setSending] = useState(false)

  const load = useCallback(async () => {
    try {
      const data = await devopsApi(`/api/devops/claude/threads${archived ? '?archived=1' : ''}`)
      setThreads(data.threads || [])
      setError(null)
    } catch (err) {
      setError(err.message)
    }
  }, [archived])

  useEffect(() => { setThreads(null); load() }, [load])
  usePullToRefresh(load)

  // Refresh while any chat is working, so states flip without a reload.
  const anyWorking = threads?.some(t => t.state === 'working')
  useEffect(() => {
    const id = setInterval(() => load().catch(() => {}), anyWorking ? 5000 : 30000)
    return () => clearInterval(id)
  }, [anyWorking, load])

  async function start(text) {
    setSending(true)
    try {
      const { thread } = await devopsApi('/api/devops/claude/threads', { method: 'POST', body: { text } })
      announceClaudeChanged()
      router.push(`/admin/devops/claude/${thread.id}`)
      return true
    } catch (err) {
      notify(err.message, 'error')
      load()
      return false
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="Claude"
        description="Ask about the code or ask for a change. Claude answers, or writes a plan for you to approve. Approved plans become PRs in Approvals."
        actions={
          <Button size="sm" variant="ghost" icon={archived ? Inbox : Archive} onClick={() => setArchived(a => !a)}>
            {archived ? 'Open chats' : 'Archived'}
          </Button>
        }
      />

      {!archived && (
        <Card className="mb-5 p-3 sm:p-4">
          <Composer onSend={start} sending={sending} placeholder="What should Claude look at or change?" />
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {SUGGESTIONS.map(s => (
              <button
                key={s}
                type="button"
                onClick={() => start(s)}
                disabled={sending}
                className="max-w-full cursor-pointer truncate rounded-full border border-adm-border px-3 py-1.5 text-left text-xs text-adm-muted transition-colors hover:border-adm-border-strong hover:text-adm-text disabled:cursor-not-allowed disabled:opacity-50"
              >
                {s}
              </button>
            ))}
          </div>
        </Card>
      )}

      {error && !threads ? (
        <EmptyState icon={Bot} title="Couldn't load chats" description={error} action={<Button onClick={load}>Try again</Button>} />
      ) : !threads ? (
        <PageLoader />
      ) : threads.length === 0 ? (
        <Card>
          <EmptyState
            icon={archived ? Archive : Bot}
            title={archived ? 'No archived chats' : 'No chats yet'}
            description={archived ? 'Chats you archive land here.' : 'Send a message above. Claude replies in about a minute.'}
          />
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <ul className="divide-y divide-adm-border">
            {threads.map(t => <ThreadRow key={t.id} thread={t} />)}
          </ul>
        </Card>
      )}
    </div>
  )
}
