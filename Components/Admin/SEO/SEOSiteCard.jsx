'use client';

export default function SEOSiteCard({ site, isSelected, onClick, onRemove, onLinkBusiness, linkedBusiness }) {
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

      {/* Linked Business Info */}
      <div className="mt-3">
        {site.business_id && linkedBusiness ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onLinkBusiness?.();
            }}
            className="w-full flex items-center gap-2 p-2 bg-teal-900/30 border border-teal-700/50 rounded text-left hover:bg-teal-900/50 transition-colors"
          >
            <svg className="w-4 h-4 text-teal-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <div className="flex-1 min-w-0">
              <p className="text-teal-300 text-xs font-medium truncate">
                {linkedBusiness.name}
              </p>
              {linkedBusiness.industry && (
                <p className="text-teal-400/70 text-xs truncate">{linkedBusiness.industry}</p>
              )}
            </div>
            <svg className="w-3 h-3 text-teal-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
        ) : (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onLinkBusiness?.();
            }}
            className="w-full flex items-center justify-center gap-2 p-2 border border-dashed border-gray-600 rounded text-gray-400 hover:border-teal-500 hover:text-teal-400 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            <span className="text-xs">Link to Business</span>
          </button>
        )}
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
