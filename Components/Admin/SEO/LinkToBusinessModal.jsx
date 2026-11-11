'use client';

import { useEffect, useState } from 'react';
import { Building2, Check, Link2, Search } from 'lucide-react';
import { Alert, Button, Modal, SearchInput, Spinner, cx, focusRing } from './ui';

export default function LinkToBusinessModal({ site, onLink, onClose }) {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [linking, setLinking] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const t = setTimeout(async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (search) params.set('search', search);
        const res = await fetch(`/api/crm/businesses?${params}`);
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        setBusinesses(data.businesses || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(t);
  }, [search]);

  async function run(businessId, kind) {
    setLinking(kind);
    setError(null);
    try {
      await onLink(businessId);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLinking(null);
    }
  }

  return (
    <Modal
      title="Link to a CRM business"
      description={site.display_name}
      onClose={onClose}
      size="lg"
      footer={
        <>
          {site.business_id && (
            <Button variant="danger-ghost" className="mr-auto" onClick={() => run(null, 'unlink')} loading={linking === 'unlink'} disabled={!!linking}>
              Unlink current
            </Button>
          )}
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button variant="primary" icon={Link2} onClick={() => run(selected.id, 'link')} loading={linking === 'link'} disabled={!selected || !!linking}>
            Link business
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <SearchInput value={search} onChange={setSearch} placeholder="Search businesses by name" icon={Search} />
        {error && <Alert tone="bad">{error}</Alert>}
        {loading ? (
          <div className="flex justify-center py-8"><Spinner /></div>
        ) : businesses.length === 0 ? (
          <p className="py-8 text-center text-sm text-adm-muted">
            {search ? 'No businesses match that search.' : 'No businesses in the CRM yet.'}
          </p>
        ) : (
          <ul className="max-h-80 space-y-1.5 overflow-y-auto pr-1" role="listbox" aria-label="Businesses">
            {businesses.map(b => {
              const active = selected?.id === b.id;
              const current = site.business_id === b.id;
              return (
                <li key={b.id} role="option" aria-selected={active}>
                  <button
                    type="button"
                    onClick={() => setSelected(b)}
                    className={cx(
                      'flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition-colors cursor-pointer',
                      active ? 'border-adm-accent bg-teal-500/5' : 'border-adm-border hover:border-adm-border-strong',
                      focusRing
                    )}
                  >
                    <Building2 className="h-4 w-4 shrink-0 text-adm-subtle" aria-hidden />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-adm-text">
                        {b.name} {current && <span className="font-normal text-adm-subtle">(current)</span>}
                      </span>
                      {b.website && <span className="block truncate text-xs text-adm-subtle">{b.website}</span>}
                    </span>
                    <span className="hidden text-xs text-adm-subtle sm:inline">{b.industry}</span>
                    <span className="text-xs tabular-nums text-adm-subtle">{b.contact_count || 0} contacts</span>
                    {active && <Check className="h-4 w-4 text-adm-accent" aria-hidden />}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </Modal>
  );
}
