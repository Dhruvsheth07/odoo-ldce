export default function ErrorState({ title = 'Something went wrong', message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center animate-fade-in">
      <div className="w-20 h-20 rounded-full bg-error-container flex items-center justify-center mb-6">
        <span className="material-symbols-outlined text-[40px] text-error">error</span>
      </div>
      <h3 className="text-headline-md text-primary mb-2">{title}</h3>
      {message && <p className="text-body-md text-secondary max-w-md mb-6">{message}</p>}
      {onRetry && (
        <button onClick={onRetry} className="btn btn-secondary">
          <span className="material-symbols-outlined text-[18px]">refresh</span>
          Try Again
        </button>
      )}
    </div>
  );
}
