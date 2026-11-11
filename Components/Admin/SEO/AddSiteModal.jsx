'use client';

import { useState } from 'react';
import { Check, ExternalLink, Plus } from 'lucide-react';
import { Alert, Button, Field, Modal, cx, inputClass } from './ui';

const PERMISSIONS = {
  siteOwner: 'Owner',
  siteFullUser: 'Full access',
  siteRestrictedUser: 'Restricted',
  siteUnverifiedUser: 'Unverified',
};

export default function AddSiteModal({ availableSites, onAdd, onClose }) {
  const [selectedSite, setSelectedSite] = useState(null);
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e?.preventDefault();
    if (!selectedSite) return setError('Pick a site first');
    setLoading(true);
    setError(null);
    try {
      await onAdd(selectedSite, displayName || null);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }

  return (
    <Modal
      title="Add a site"
      description="Pick a property from Google Search Console."
      onClose={onClose}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button variant="primary" icon={Plus} onClick={handleSubmit} loading={loading} disabled={!selectedSite}>Add site</Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && <Alert tone="bad">{error}</Alert>}

        {availableSites.length === 0 ? (
          <Alert
            tone="info"
            title="No more sites to add"
            action={
              <div className="flex flex-wrap gap-2">
                <Button size="sm" icon={ExternalLink} href="https://search.google.com/search-console" external>Open Search Console</Button>
                <Button size="sm" variant="ghost" href="/admin">Reconnect Google</Button>
              </div>
            }
          >
            Every Search Console property is already added, the site still needs verifying in Search Console, or the Google connection needs refreshing.
          </Alert>
        ) : (
          <fieldset>
            <legend className="mb-2 text-sm font-medium">Search Console property</legend>
            <div className="max-h-60 space-y-1.5 overflow-y-auto pr-1">
              {availableSites.map(site => {
                const checked = selectedSite === site.siteUrl;
                return (
                  <label
                    key={site.siteUrl}
                    className={cx(
                      'flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2.5 transition-colors',
                      checked ? 'border-adm-accent bg-teal-500/5' : 'border-adm-border hover:border-adm-border-strong',
                      'has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-adm-accent'
                    )}
                  >
                    <input
                      type="radio"
                      name="site"
                      value={site.siteUrl}
                      checked={checked}
                      onChange={() => setSelectedSite(site.siteUrl)}
                      className="sr-only"
                    />
                    <span className={cx('flex h-4 w-4 shrink-0 items-center justify-center rounded-full border', checked ? 'border-adm-accent bg-adm-accent' : 'border-adm-border-strong')}>
                      {checked && <Check className="h-3 w-3 text-adm-bg" aria-hidden />}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm text-adm-text">{site.siteUrl}</span>
                      <span className="block text-xs text-adm-subtle">{PERMISSIONS[site.permissionLevel] || site.permissionLevel}</span>
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>
        )}

        <Field label="Display name" htmlFor="add-site-name" hint="Optional. How the site shows up in this dashboard.">
          <input
            id="add-site-name"
            type="text"
            value={displayName}
            onChange={e => setDisplayName(e.target.value)}
            placeholder="e.g. UC Blinds"
            className={inputClass}
          />
        </Field>
      </form>
    </Modal>
  );
}
