'use client';

import { useState, useEffect } from 'react';

export default function LinkToBusinessModal({ site, onLink, onClose }) {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [linking, setLinking] = useState(false);
  const [error, setError] = useState(null);

  // Fetch businesses
  useEffect(() => {
    async function fetchBusinesses() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (search) params.set('search', search);

        const res = await fetch(`/api/crm/businesses?${params}`);
        const data = await res.json();

        if (data.error) {
          setError(data.error);
          return;
        }

        setBusinesses(data.businesses || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    const debounce = setTimeout(fetchBusinesses, 300);
    return () => clearTimeout(debounce);
  }, [search]);

  async function handleLink() {
    if (!selectedBusiness) return;

    setLinking(true);
    setError(null);

    try {
      await onLink(selectedBusiness.id);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLinking(false);
    }
  }

  async function handleUnlink() {
    setLinking(true);
    setError(null);

    try {
      await onLink(null); // Pass null to unlink
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLinking(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-[#0a0a0a] rounded-lg border border-[#262626] w-full max-w-lg max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-[#262626]">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">Link to Business</h2>
              <p className="text-gray-400 text-sm mt-1">{site.display_name}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Current Link Status */}
          {site.business_id && (
            <div className="mt-4 p-3 bg-teal-900/30 border border-teal-700/50 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <span className="text-teal-300 text-sm">Currently linked to a business</span>
                </div>
                <button
                  onClick={handleUnlink}
                  disabled={linking}
                  className="text-red-400 hover:text-red-300 text-sm transition-colors disabled:opacity-50"
                >
                  Unlink
                </button>
              </div>
            </div>
          )}

          {/* Search */}
          <div className="mt-4 relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search businesses by name..."
              className="w-full bg-[#171717] border border-[#262626] rounded-lg px-4 py-2 pl-10 text-white placeholder-gray-500 focus:outline-none focus:border-teal-500"
            />
            <svg className="w-5 h-5 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Businesses List */}
        <div className="flex-1 overflow-y-auto p-4">
          {error && (
            <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-teal-400"></div>
            </div>
          ) : businesses.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              {search ? 'No businesses found matching your search' : 'No businesses available'}
            </div>
          ) : (
            <div className="space-y-2">
              {businesses.map((business) => (
                <button
                  key={business.id}
                  onClick={() => setSelectedBusiness(business)}
                  className={`
                    w-full text-left p-3 rounded-lg border transition-all
                    ${selectedBusiness?.id === business.id
                      ? 'bg-teal-900/30 border-teal-500'
                      : 'bg-[#171717] border-[#262626] hover:border-[#404040]'
                    }
                  `}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        <span className="text-white font-medium truncate">
                          {business.name}
                        </span>
                      </div>
                      {business.website && (
                        <p className="text-gray-400 text-sm truncate mt-1 ml-6">{business.website}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      {business.industry && (
                        <span className="text-xs px-2 py-0.5 rounded bg-gray-700 text-gray-300">
                          {business.industry}
                        </span>
                      )}
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <span>{business.contact_count || 0} contacts</span>
                      </div>
                      {selectedBusiness?.id === business.id && (
                        <svg className="w-5 h-5 text-teal-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#262626] flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleLink}
            disabled={!selectedBusiness || linking}
            className="bg-teal-500 hover:bg-teal-600 disabled:bg-teal-500/50 text-white px-4 py-2 rounded-lg transition-colors disabled:cursor-not-allowed"
          >
            {linking ? 'Linking...' : 'Link Business'}
          </button>
        </div>
      </div>
    </div>
  );
}
