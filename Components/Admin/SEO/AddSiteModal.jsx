'use client';

import { useState } from 'react';

export default function AddSiteModal({ availableSites, onAdd, onClose }) {
  const [selectedSite, setSelectedSite] = useState(null);
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!selectedSite) {
      setError('Please select a site');
      return;
    }

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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg border border-gray-700 w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-white">Add Site</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {error && (
            <div className="bg-red-900/50 border border-red-700 text-red-200 px-3 py-2 rounded text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Select Site from Search Console
            </label>
            {availableSites.length === 0 ? (
              <div className="text-gray-400 text-sm bg-gray-700 rounded p-4 space-y-3">
                <p>No additional sites available. This could mean:</p>
                <ul className="list-disc pl-5 space-y-1 text-gray-500">
                  <li>All your Search Console sites are already added</li>
                  <li>You need to add/verify sites in Google Search Console first</li>
                  <li>You may need to reconnect your Google account to refresh permissions</li>
                </ul>
                <div className="flex gap-3 pt-2">
                  <a
                    href="https://search.google.com/search-console"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-teal-400 hover:text-teal-300 text-sm"
                  >
                    Open Search Console →
                  </a>
                  <a
                    href="/admin"
                    className="text-blue-400 hover:text-blue-300 text-sm"
                  >
                    Reconnect Google →
                  </a>
                </div>
              </div>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {availableSites.map((site) => (
                  <label
                    key={site.siteUrl}
                    className={`
                      flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all
                      ${selectedSite === site.siteUrl
                        ? 'border-teal-500 bg-teal-500/10'
                        : 'border-gray-600 hover:border-gray-500'
                      }
                    `}
                  >
                    <input
                      type="radio"
                      name="site"
                      value={site.siteUrl}
                      checked={selectedSite === site.siteUrl}
                      onChange={() => setSelectedSite(site.siteUrl)}
                      className="text-teal-500 focus:ring-teal-500"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-white text-sm truncate">{site.siteUrl}</div>
                      <div className="text-gray-400 text-xs">
                        {formatPermission(site.permissionLevel)}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Display Name (Optional)
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="e.g., My Website"
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-teal-500"
            />
            <p className="text-gray-500 text-xs mt-1">
              A friendly name to display in the dashboard
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !selectedSite}
              className="flex-1 bg-teal-500 hover:bg-teal-600 text-white py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Adding...' : 'Add Site'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function formatPermission(permission) {
  const map = {
    siteOwner: 'Owner',
    siteFullUser: 'Full Access',
    siteRestrictedUser: 'Restricted',
    siteUnverifiedUser: 'Unverified'
  };
  return map[permission] || permission;
}
