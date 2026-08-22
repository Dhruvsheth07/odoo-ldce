import { useState } from 'react';
import { shareApi } from '../../services/expenseApi';
import toast from 'react-hot-toast';

export default function ShareSettings({ trip, onRefresh }) {
  const [toggling, setToggling] = useState(false);

  const handleToggle = async () => {
    setToggling(true);
    try {
      await shareApi.toggle(trip.id);
      toast.success(trip.isPublic ? 'Trip is now private.' : 'Trip is now public!');
      if (onRefresh) onRefresh();
    } catch {
      toast.error('Failed to update sharing.');
    }
    setToggling(false);
  };

  const shareUrl = trip.shareToken
    ? `${window.location.origin}/public/trips/${trip.shareToken}`
    : null;

  const copyLink = () => {
    if (shareUrl) {
      navigator.clipboard.writeText(shareUrl);
      toast.success('Link copied!');
    }
  };

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-[var(--spacing-stack-lg)]">
      {/* Share Toggle */}
      <div className="card p-8">
        <div className="flex items-start gap-6">
          <div className="w-16 h-16 rounded-full bg-primary-container flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[32px] text-on-primary">
              {trip.isPublic ? 'public' : 'lock'}
            </span>
          </div>
          <div className="flex-grow">
            <h2 className="text-headline-md text-primary mb-2">
              {trip.isPublic ? 'Trip is Public' : 'Trip is Private'}
            </h2>
            <p className="text-body-md text-secondary mb-6">
              {trip.isPublic
                ? 'Anyone with the link can view this trip itinerary. Your personal data remains private.'
                : 'Only you can see this trip. Make it public to share with friends and family.'}
            </p>
            <button
              onClick={handleToggle}
              disabled={toggling}
              className={`btn ${trip.isPublic ? 'btn-secondary' : 'btn-primary'}`}
            >
              <span className="material-symbols-outlined text-[18px]">
                {trip.isPublic ? 'lock' : 'public'}
              </span>
              {toggling ? 'Updating...' : trip.isPublic ? 'Make Private' : 'Make Public'}
            </button>
          </div>
        </div>
      </div>

      {/* Share Link */}
      {trip.isPublic && shareUrl && (
        <div className="card p-8">
          <h3 className="text-headline-md text-primary mb-4">Share Link</h3>
          <div className="flex gap-3">
            <input
              className="input flex-grow"
              value={shareUrl}
              readOnly
              onClick={e => e.target.select()}
            />
            <button onClick={copyLink} className="btn btn-primary">
              <span className="material-symbols-outlined text-[18px]">content_copy</span>
              Copy
            </button>
          </div>
          <p className="text-body-sm text-secondary mt-3">
            <span className="material-symbols-outlined text-[14px] align-text-bottom mr-1">info</span>
            This link gives read-only access. Viewers cannot edit your trip.
          </p>
        </div>
      )}
    </div>
  );
}
