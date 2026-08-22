export default function EmptyState({ icon = 'explore', title, message, actionLabel, onAction }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center animate-fade-in">
      <div className="w-20 h-20 rounded-full bg-surface-container flex items-center justify-center mb-6">
        <span className="material-symbols-outlined text-[40px] text-secondary">{icon}</span>
      </div>
      <h3 className="text-headline-md text-primary mb-2">{title}</h3>
      {message && <p className="text-body-md text-secondary max-w-md mb-6">{message}</p>}
      {actionLabel && onAction && (
        <button onClick={onAction} className="btn btn-primary">
          {actionLabel}
        </button>
      )}
    </div>
  );
}
