import Modal from './Modal';

export default function ConfirmDialog({ isOpen, onClose, onConfirm, title, message, confirmLabel = 'Confirm', danger = false }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <p className="text-body-md text-secondary mb-8">{message}</p>
      <div className="flex justify-end gap-3">
        <button onClick={onClose} className="btn btn-ghost">Cancel</button>
        <button
          onClick={() => { onConfirm(); onClose(); }}
          className={`btn ${danger ? 'btn-danger' : 'btn-primary'}`}
        >
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
