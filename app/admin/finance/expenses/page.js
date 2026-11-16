// app/admin/finance/expenses/page.js — Expense ledger
'use client'

import { useEffect, useMemo, useState } from 'react'
import { format } from 'date-fns'
import { ChevronRight, Paperclip, Pencil, Plus, Receipt, Repeat, Trash2, Upload } from 'lucide-react'
import { usePersistedState } from '@/lib/usePersistedState'
import { invalidate, useCachedFetch } from '@/lib/useCachedFetch'
import { EXPENSE_CATEGORIES } from '@/lib/finance'
import {
  Badge, Button, Card, CardHeader, ConfirmButton, Drawer, EmptyState, PageHeader, SegmentedControl, Skeleton,
  StatTile, Table, Td, Th, cx, focusRing, useSort, useToast,
} from '@/Components/Admin/ui'
import {
  BarList, CategoryTag, DetailRow, MONTHS, SelectInput, YearSelect, categoryItems, fmtMoney,
} from '@/Components/Admin/Finance/parts'
import ExpenseForm from '@/Components/Admin/Finance/ExpenseForm'
import CSVImportModal from '@/Components/Admin/Finance/CSVImportModal'
import MonthlyExpenseSummary from '@/Components/Admin/Finance/MonthlyExpenseSummary'
import Fab from '@/Components/Admin/Mobile/Fab'

const dateOf = (d) => new Date(d + 'T00:00:00')

export default function ExpensesPage() {
  const notify = useToast()
  const [year, setYear] = usePersistedState('year', new Date().getFullYear())
  const [month, setMonth] = usePersistedState('month', '')
  const [category, setCategory] = usePersistedState('category', '')
  const [view, setView] = usePersistedState('view', 'transactions')
  const [showForm, setShowForm] = useState(false)
  const [showImport, setShowImport] = useState(false)
  const [editEntry, setEditEntry] = useState(null)
  const [selected, setSelected] = useState(null)

  // Home-screen quick action: /admin/finance/{page}?new=1 opens the add form
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get('new') === '1') {
      setShowForm(true)
      window.history.replaceState(null, '', window.location.pathname)
    }
  }, [])

  // The page number belongs to one set of filters; changing a filter starts at page 1
  const filterKey = `${year}|${month}|${category}`
  const [pageState, setPageState] = useState({ key: filterKey, n: 1 })
  const page = pageState.key === filterKey ? pageState.n : 1
  const setPage = (n) => setPageState({ key: filterKey, n })

  const params = new URLSearchParams({ year: String(year), page: String(page), limit: '20' })
  if (month) params.set('month', month)
  if (category) params.set('category', category)
  const list = useCachedFetch(`/api/finance/expenses?${params}`, {
    keepPrevious: true,
    onError: () => notify('Could not load expenses', 'error'),
  })
  const { data: stats } = useCachedFetch(`/api/finance/stats?year=${year}`)

  const entries = list.data?.entries || []
  const pagination = list.data?.pagination || { page: 1, totalPages: 1, total: 0 }
  const loading = list.loading
  const refresh = () => invalidate('/api/finance/')

  const handleDelete = async (entry) => {
    const res = await fetch(`/api/finance/expenses/${entry.id}`, { method: 'DELETE' })
    if (!res.ok) return notify("Couldn't delete that expense", 'error')
    notify(`Deleted ${entry.description}`, 'success')
    setSelected(null)
    refresh()
  }

  const openForm = (entry = null) => {
    setSelected(null)
    setEditEntry(entry)
    setShowForm(true)
  }

  const [sorted, thProps] = useSort(entries, { key: 'date', dir: 'desc' }, {
    amount: (e) => parseFloat(e.amount),
    description: (e) => (e.description || '').toLowerCase(),
  })

  const yearTotal = stats?.overview?.ytdExpenses
  const topCategory = useMemo(
    () => [...(stats?.byCategory || [])].sort((a, b) => b.total - a.total)[0],
    [stats]
  )
  const filtered = Boolean(month || category)

  return (
    <div>
      <PageHeader
        title="Expenses"
        description="Business spending, sorted into Schedule C categories"
        actions={
          <>
            <Button icon={Upload} onClick={() => setShowImport(true)}>Import CSV</Button>
            <Button variant="primary" icon={Plus} onClick={() => openForm()} className="hidden md:inline-flex">Add expense</Button>
          </>
        }
      />

      <section aria-label="Totals" className="mb-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
        <StatTile label={`${year} expenses`} value={fmtMoney(yearTotal)} loading={!stats} hint="year to date" />
        <StatTile label="Entries" value={pagination.total} loading={loading} hint={filtered ? 'matching filters' : `in ${year}`} />
        <div className="col-span-2 lg:col-span-1">
          <StatTile
            label="Top category"
            value={topCategory ? fmtMoney(topCategory.total) : '—'}
            loading={!stats}
            hint={topCategory?.label || 'no spending yet'}
          />
        </div>
      </section>

      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <SegmentedControl
          label="View"
          value={view}
          onChange={setView}
          options={[
            { value: 'transactions', label: 'Transactions' },
            { value: 'monthly', label: 'By month' },
            { value: 'categories', label: 'By category' },
          ]}
          className="w-full sm:w-auto [&>button]:flex-1 [&>button]:justify-center"
        />
        <YearSelect value={year} onChange={setYear} className="hidden sm:block" />
      </div>

      {view === 'monthly' && (
        <MonthlyExpenseSummary monthly={stats?.monthly} loading={!stats} year={year} yearSelect={<YearSelect value={year} onChange={setYear} />} />
      )}

      {view === 'categories' && (
        <Card>
          <CardHeader
            title="Spending by category"
            description={`${year} · ${fmtMoney(yearTotal)} total`}
            actions={<YearSelect value={year} onChange={setYear} className="sm:hidden" />}
          />
          <div className="p-4 sm:p-5">
            {!stats ? <Skeleton className="h-48 w-full" /> : <BarList items={categoryItems(stats.byCategory)} emptyText="No expenses recorded yet" />}
          </div>
        </Card>
      )}

      {view === 'transactions' && (
        <Card>
          <div className="scrollbar-hide flex gap-2 overflow-x-auto border-b border-adm-border p-3 sm:px-5 sm:py-4">
            <YearSelect value={year} onChange={setYear} className="shrink-0 sm:hidden" />
            <SelectInput value={month} onChange={setMonth} label="Month" className="shrink-0">
              <option value="">All months</option>
              {MONTHS.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
            </SelectInput>
            <SelectInput value={category} onChange={setCategory} label="Category" className="min-w-0 shrink-0 sm:max-w-xs">
              <option value="">All categories</option>
              {Object.entries(EXPENSE_CATEGORIES).map(([key, { label }]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </SelectInput>
          </div>

          {loading ? (
            <div className="space-y-3 p-4 sm:p-5">
              {[0, 1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-11 w-full" />)}
            </div>
          ) : entries.length === 0 ? (
            <EmptyState
              icon={Receipt}
              title={filtered ? 'No matching expenses' : `No expenses in ${year} yet`}
              description={filtered ? 'Try a different month or category.' : 'Add one by hand or import a CSV from your bank.'}
              action={!filtered && <Button variant="primary" icon={Plus} onClick={() => openForm()}>Add expense</Button>}
            />
          ) : (
            <>
              <ul className="divide-y divide-adm-border md:hidden">
                {sorted.map((entry) => (
                  <li key={entry.id}>
                    <button
                      type="button"
                      onClick={() => setSelected(entry)}
                      className="flex min-h-16 w-full cursor-pointer items-center gap-3 px-4 py-3 text-left active:bg-adm-raised"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="flex items-center gap-1.5 text-[15px] font-medium text-adm-text">
                          <span className="truncate">{entry.description}</span>
                          {entry.is_recurring && <Repeat className="h-3.5 w-3.5 shrink-0 text-adm-info" aria-label="Recurring" />}
                          {entry.receipt_url && <Paperclip className="h-3.5 w-3.5 shrink-0 text-adm-subtle" aria-label="Has receipt" />}
                        </p>
                        <div className="mt-0.5 flex min-w-0 items-center gap-2 text-xs text-adm-subtle">
                          <span className="shrink-0">{format(dateOf(entry.date), 'MMM d')}</span>
                          <CategoryTag category={entry.category} />
                        </div>
                      </div>
                      <span className="shrink-0 text-[15px] font-semibold tabular-nums text-adm-text">
                        −{fmtMoney(entry.amount, { cents: true })}
                      </span>
                      <ChevronRight className="h-4 w-4 shrink-0 text-adm-subtle" aria-hidden />
                    </button>
                  </li>
                ))}
              </ul>

              <Table className="hidden md:block">
                <thead>
                  <tr>
                    <Th {...thProps('description', 'asc')}>Description</Th>
                    <Th {...thProps('date')}>Date</Th>
                    <Th>Category</Th>
                    <Th>Receipt</Th>
                    <Th align="right" {...thProps('amount')}>Amount</Th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-adm-border">
                  {sorted.map((entry) => (
                    <tr key={entry.id} onClick={() => setSelected(entry)} className="cursor-pointer transition-colors hover:bg-adm-raised">
                      <Td>
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); setSelected(entry) }}
                          className={cx('inline-flex cursor-pointer items-center gap-2 rounded text-left font-medium text-adm-text hover:text-adm-accent', focusRing)}
                        >
                          {entry.description}
                          {entry.is_recurring && <Badge tone="info" icon={Repeat}>Recurring</Badge>}
                        </button>
                      </Td>
                      <Td className="whitespace-nowrap text-adm-muted">{format(dateOf(entry.date), 'MMM d, yyyy')}</Td>
                      <Td><CategoryTag category={entry.category} className="max-w-[14rem]" /></Td>
                      <Td>
                        {entry.receipt_url ? (
                          <a
                            href={entry.receipt_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className={cx('inline-flex items-center gap-1 rounded text-adm-accent hover:underline', focusRing)}
                          >
                            <Paperclip className="h-3.5 w-3.5" aria-hidden /> View
                          </a>
                        ) : <span className="text-adm-subtle">—</span>}
                      </Td>
                      <Td align="right" numeric className="font-medium text-adm-text">{fmtMoney(entry.amount, { cents: true })}</Td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-between gap-3 border-t border-adm-border px-4 py-3 sm:px-5">
                  <p className="text-xs text-adm-subtle">Page {pagination.page} of {pagination.totalPages}</p>
                  <div className="flex gap-2">
                    <Button size="sm" disabled={pagination.page <= 1} onClick={() => setPage(pagination.page - 1)}>Previous</Button>
                    <Button size="sm" disabled={pagination.page >= pagination.totalPages} onClick={() => setPage(pagination.page + 1)}>Next</Button>
                  </div>
                </div>
              )}
            </>
          )}
        </Card>
      )}

      {selected && (
        <Drawer
          onClose={() => setSelected(null)}
          label={selected.description}
          header={
            <div>
              <p className="text-sm text-adm-muted">{selected.description}</p>
              <p className="mt-0.5 text-2xl font-semibold tabular-nums text-adm-text">{fmtMoney(selected.amount, { cents: true })}</p>
            </div>
          }
          footer={
            <div className="flex flex-wrap items-center gap-2">
              <Button variant="primary" icon={Pencil} onClick={() => openForm(selected)}>Edit</Button>
              {selected.receipt_url && (
                <Button icon={Paperclip} href={selected.receipt_url} external>Receipt</Button>
              )}
              <ConfirmButton icon={Trash2} confirmLabel="Tap again to delete" onConfirm={() => handleDelete(selected)} className="ml-auto">
                Delete
              </ConfirmButton>
            </div>
          }
        >
          <dl className="divide-y divide-adm-border text-sm">
            <DetailRow label="Date">{format(dateOf(selected.date), 'EEEE, MMMM d, yyyy')}</DetailRow>
            <DetailRow label="Category"><CategoryTag category={selected.category} className="text-sm text-adm-text" /></DetailRow>
            <DetailRow label="Schedule C">{EXPENSE_CATEGORIES[selected.category]?.scheduleC || '—'}</DetailRow>
            <DetailRow label="Recurring">{selected.is_recurring ? 'Yes' : 'No'}</DetailRow>
            <DetailRow label="Receipt">{selected.receipt_url ? 'Attached' : <span className="text-adm-subtle">None. Edit to attach one.</span>}</DetailRow>
          </dl>
          {selected.notes && (
            <div className="mt-5 rounded-lg border border-adm-border bg-adm-raised p-3">
              <p className="mb-1 text-xs font-medium text-adm-subtle">Notes</p>
              <p className="whitespace-pre-wrap text-sm text-adm-muted">{selected.notes}</p>
            </div>
          )}
        </Drawer>
      )}

      {view === 'transactions' && <Fab onClick={() => openForm()} label="Add expense" />}

      <ExpenseForm
        isOpen={showForm}
        onClose={() => { setShowForm(false); setEditEntry(null) }}
        onSave={refresh}
        entry={editEntry}
      />
      <CSVImportModal isOpen={showImport} onClose={() => setShowImport(false)} onComplete={refresh} type="expenses" />
    </div>
  )
}
