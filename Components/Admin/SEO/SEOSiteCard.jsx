'use client';

export default function SEOSiteCard({ site, isSelected, onClick, onRemove }) {
  return (
    <div
      onClick={onClick}
      className={`
        bg-gray-800 rounded-lg border p-4 cursor-pointer transition-all
        ${isSelected
          ? 'border-teal-500 ring-1 ring-teal-500/50'
          : 'border-gray-700 hover:border-gray-600'
        }
      `}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-medium truncate">{site.display_name}</h3>
          <p className="text-gray-400 text-sm truncate">{site.site_url}</p>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="text-gray-500 hover:text-red-400 p-1 transition-colors"
          title="Remove site"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {site.last_sync_at && (
        <div className="mt-2 flex items-center gap-1 text-xs text-gray-500">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Synced {formatTimeAgo(site.last_sync_at)}</span>
        </div>
      )}

      {site.permission_level && (
        <div className="mt-2">
          <span className={`
            text-xs px-2 py-0.5 rounded
            ${site.permission_level === 'siteOwner'
              ? 'bg-green-900/50 text-green-300'
              : 'bg-gray-700 text-gray-300'
            }
          `}>
            {formatPermission(site.permission_level)}
          </span>
        </div>
      )}
    </div>
  );
}

function formatTimeAgo(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
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
