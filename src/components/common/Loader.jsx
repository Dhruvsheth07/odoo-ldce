export default function LoadingSkeleton({ type = 'card', count = 3 }) {
  if (type === 'card') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[var(--spacing-gutter)]">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="card p-0">
            <div className="skeleton h-48 w-full rounded-b-none" />
            <div className="p-6 space-y-3">
              <div className="skeleton h-6 w-3/4" />
              <div className="skeleton h-4 w-1/2" />
              <div className="skeleton h-4 w-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'list') {
    return (
      <div className="space-y-3">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="card p-6 flex items-center gap-4">
            <div className="skeleton w-12 h-12 rounded-full shrink-0" />
            <div className="flex-grow space-y-2">
              <div className="skeleton h-5 w-2/5" />
              <div className="skeleton h-4 w-3/5" />
            </div>
            <div className="skeleton h-8 w-20 rounded-full" />
          </div>
        ))}
      </div>
    );
  }

  if (type === 'detail') {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="skeleton h-64 w-full rounded-xl" />
        <div className="space-y-3">
          <div className="skeleton h-8 w-1/2" />
          <div className="skeleton h-4 w-full" />
          <div className="skeleton h-4 w-3/4" />
        </div>
      </div>
    );
  }

  return null;
}
