'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/Components/Admin/AdminAuthProvider';
import SEOSiteCard from '@/Components/Admin/SEO/SEOSiteCard';
import AddSiteModal from '@/Components/Admin/SEO/AddSiteModal';
import LinkToBusinessModal from '@/Components/Admin/SEO/LinkToBusinessModal';

export default function SEOSitesPage() {
  const { user, loading: authLoading } = useAdminAuth();
  const router = useRouter();

  const [sites, setSites] = useState([]);
  const [availableSites, setAvailableSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [siteToLink, setSiteToLink] = useState(null);
  const [linkedBusinesses, setLinkedBusinesses] = useState({});
  const [search, setSearch] = useState('');
  const [error, setError] = useState(null);
  const [googleConnected, setGoogleConnected] = useState(false);

  // Check Google connection
  useEffect(() => {
    if (!user?.email) return;
    fetch(`/api/auth/google/status?email=${encodeURIComponent(user.email)}`)
      .then(r => r.json())
      .then(data => setGoogleConnected(data.connected))
      .catch(() => {});
  }, [user?.email]);

  // Fetch sites
  useEffect(() => {
    if (!user?.email || !googleConnected) return;

    async function fetchSites() {
      setLoading(true);
      try {
        const res = await fetch(`/api/seo/sites?email=${encodeURIComponent(user.email)}&includeAvailable=true`);
        const data = await res.json();
        if (data.error) { setError(data.error); return; }
        setSites(data.sites || []);
        setAvailableSites(data.availableSites || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchSites();
  }, [user?.email, googleConnected]);

  // Fetch linked businesses
  useEffect(() => {
    if (!sites || sites.length === 0) return;
    const toFetch = sites
      .filter(s => s.business_id && !linkedBusinesses[s.business_id])
      .map(s => s.business_id);
    if (toFetch.length === 0) return;

    Promise.all(
      toFetch.map(id => fetch(`/api/crm/businesses/${id}`).then(r => r.json()))
    ).then(results => {
      const updated = { ...linkedBusinesses };
      results.forEach(r => { if (r.business) updated[r.business.id] = r.business; });
      setLinkedBusinesses(updated);
    }).catch(() => {});
  }, [sites]);

  // Filtered sites
  const filteredSites = useMemo(() => {
    if (!search.trim()) return sites;
    const q = search.toLowerCase();
    return sites.filter(
      s => s.display_name?.toLowerCase().includes(q) || s.site_url?.toLowerCase().includes(q)
    );
  }, [sites, search]);

  // Add site
  async function handleAddSite(siteUrl, displayName) {
    const res = await fetch('/api/seo/sites', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ siteUrl, googleEmail: user.email, displayName })
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error);

    // Refresh
    const sitesRes = await fetch(`/api/seo/sites?email=${encodeURIComponent(user.email)}&includeAvailable=true`);
    const sitesData = await sitesRes.json();
    setSites(sitesData.sites || []);
    setAvailableSites(sitesData.availableSites || []);
    setShowAddModal(false);
  }

  // Remove site
  async function handleRemoveSite(siteId) {
    if (!confirm('Are you sure you want to remove this site?')) return;
    const res = await fetch(`/api/seo/sites?id=${siteId}`, { method: 'DELETE' });
    const data = await res.json();
    if (data.error) { alert('Failed to remove site: ' + data.error); return; }
    setSites(sites.filter(s => s.id !== siteId));
  }

  // Link site to business
  async function handleLinkSite(businessId) {
    if (!siteToLink) return;
    const res = await fetch(`/api/seo/sites?id=${siteToLink.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ business_id: businessId })
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error);

    setSites(sites.map(s => s.id === siteToLink.id ? { ...s, business_id: businessId } : s));

    if (businessId) {
      try {
        const bRes = await fetch(`/api/crm/businesses/${businessId}`);
        const bData = await bRes.json();
        if (bData.business) setLinkedBusinesses(prev => ({ ...prev, [businessId]: bData.business }));
      } catch {}
    }
  }

  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-400"></div>
      </div>
    );
  }

  if (!googleConnected) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-white mb-6">Sites</h1>
        <div className="bg-[#0a0a0a] rounded-lg border border-[#262626] p-8 text-center">
          <div className="text-gray-400 mb-4">Connect your Google account to manage Search Console sites.</div>
          <button
            onClick={() => router.push('/admin')}
            className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Connect Google Account
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Sites</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Site
        </button>
      </div>

      {error && (
        <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg mb-6">{error}</div>
      )}

      {/* Search */}
      {sites.length > 0 && (
        <div className="mb-6">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search sites..."
              className="w-full bg-[#0a0a0a] border border-[#262626] rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-teal-500"
            />
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-400"></div>
        </div>
      ) : sites.length === 0 ? (
        <div className="bg-[#0a0a0a] rounded-lg border border-[#262626] p-12 text-center">
          <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
          </svg>
          <h2 className="text-xl font-semibold text-white mb-2">Add Your First Site</h2>
          <p className="text-gray-400 mb-6">Start tracking SEO performance by adding a site from Google Search Console.</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2.5 rounded-lg transition-colors"
          >
            Add Site
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredSites.map(site => (
            <SEOSiteCard
              key={site.id}
              site={site}
              isSelected={false}
              onClick={() => router.push(`/admin/seo/sites/${site.id}`)}
              onRemove={() => handleRemoveSite(site.id)}
              onLinkBusiness={() => {
                setSiteToLink(site);
                setShowLinkModal(true);
              }}
              linkedBusiness={site.business_id ? linkedBusinesses[site.business_id] : null}
            />
          ))}
          {filteredSites.length === 0 && search && (
            <div className="col-span-full text-center py-8 text-gray-400">
              No sites match "{search}"
            </div>
          )}
        </div>
      )}

      {/* Add Site Modal */}
      {showAddModal && (
        <AddSiteModal
          availableSites={availableSites}
          onAdd={handleAddSite}
          onClose={() => setShowAddModal(false)}
        />
      )}

      {/* Link to Business Modal */}
      {showLinkModal && siteToLink && (
        <LinkToBusinessModal
          site={siteToLink}
          onLink={handleLinkSite}
          onClose={() => { setShowLinkModal(false); setSiteToLink(null); }}
        />
      )}
    </div>
  );
}
