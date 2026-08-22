import { useState, useEffect } from 'react';
import { expenseApi } from '../../services/expenseApi';
import LoadingSkeleton from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import ErrorState from '../../components/common/ErrorState';
import Modal from '../../components/common/Modal';
import { EXPENSE_CATEGORIES } from '../../utils/constants';
import { formatPrice, getCategoryIcon } from '../../utils/formatters';
import { formatDate } from '../../utils/dateUtils';
import toast from 'react-hot-toast';

export default function ExpenseList({ trip }) {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  const [form, setForm] = useState({
    title: '', category: 'OTHER', estimatedAmount: '', actualAmount: '', currency: trip.currency, expenseDate: '', notes: '',
  });

  const fetchExpenses = async () => {
    setLoading(true); setError(null);
    try {
      const params = categoryFilter !== 'ALL' ? { category: categoryFilter } : {};
      const { data } = await expenseApi.getAll(trip.id, params);
      setExpenses(data?.data || []);
    } catch { setError('Failed to load expenses.'); }
    setLoading(false);
  };

  useEffect(() => { fetchExpenses(); }, [trip.id, categoryFilter]);

  const resetForm = () => {
    setForm({ title: '', category: 'OTHER', estimatedAmount: '', actualAmount: '', currency: trip.currency, expenseDate: '', notes: '' });
    setEditingExpense(null);
  };

  const openAdd = () => { resetForm(); setShowModal(true); };
  const openEdit = (exp) => {
    setEditingExpense(exp);
    setForm({
      title: exp.title, category: exp.category, estimatedAmount: exp.estimatedAmount || '',
      actualAmount: exp.actualAmount || '', currency: exp.currency, expenseDate: exp.expenseDate?.split('T')[0] || '', notes: exp.notes || '',
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        estimatedAmount: form.estimatedAmount ? Number(form.estimatedAmount) : null,
        actualAmount: form.actualAmount ? Number(form.actualAmount) : null,
      };
      if (editingExpense) {
        await expenseApi.update(editingExpense.id, payload);
        toast.success('Expense updated.');
      } else {
        await expenseApi.create(trip.id, payload);
        toast.success('Expense added.');
      }
      setShowModal(false);
      resetForm();
      fetchExpenses();
    } catch { toast.error('Failed to save expense.'); }
  };

  const handleDelete = async (id) => {
    try {
      await expenseApi.delete(id);
      toast.success('Expense deleted.');
      fetchExpenses();
    } catch { toast.error('Failed to delete expense.'); }
  };

  const totalEstimated = expenses.reduce((s, e) => s + Number(e.estimatedAmount || 0), 0);
  const totalActual = expenses.reduce((s, e) => s + Number(e.actualAmount || 0), 0);

  if (loading) return <LoadingSkeleton type="list" count={5} />;
  if (error) return <ErrorState message={error} onRetry={fetchExpenses} />;

  return (
    <div className="flex flex-col gap-[var(--spacing-stack-md)]">
      {/* Header + Summary */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex gap-6">
          <div>
            <p className="text-label-caps text-secondary">Estimated</p>
            <p className="text-headline-md text-primary">{formatPrice(totalEstimated, trip.currency)}</p>
          </div>
          <div>
            <p className="text-label-caps text-secondary">Actual</p>
            <p className="text-headline-md text-primary">{formatPrice(totalActual, trip.currency)}</p>
          </div>
        </div>
        <button onClick={openAdd} className="btn btn-primary">
          <span className="material-symbols-outlined text-[18px]">add</span>
          Add Expense
        </button>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setCategoryFilter('ALL')}
          className={`px-3 py-1.5 rounded-full text-body-sm font-semibold transition-all ${
            categoryFilter === 'ALL' ? 'bg-primary-container text-on-primary' : 'bg-surface-container text-secondary hover:bg-surface-container-high'
          }`}
        >
          All
        </button>
        {EXPENSE_CATEGORIES.map(c => (
          <button
            key={c.value}
            onClick={() => setCategoryFilter(c.value)}
            className={`px-3 py-1.5 rounded-full text-body-sm font-semibold transition-all ${
              categoryFilter === c.value ? 'bg-primary-container text-on-primary' : 'bg-surface-container text-secondary hover:bg-surface-container-high'
            }`}
          >
            {c.icon} {c.label}
          </button>
        ))}
      </div>

      {/* Expense List */}
      {expenses.length === 0 ? (
        <EmptyState icon="receipt_long" title="No expenses" message="Start tracking your trip spending." actionLabel="Add Expense" onAction={openAdd} />
      ) : (
        <div className="space-y-3">
          {expenses.map(exp => (
            <div key={exp.id} className="card p-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg shrink-0"
                style={{ backgroundColor: EXPENSE_CATEGORIES.find(c => c.value === exp.category)?.color + '20' }}>
                {getCategoryIcon(exp.category)}
              </div>
              <div className="flex-grow min-w-0">
                <p className="text-body-md font-semibold text-primary truncate">{exp.title}</p>
                <p className="text-body-sm text-secondary">
                  {exp.category} {exp.expenseDate && `• ${formatDate(exp.expenseDate, 'MMM dd')}`}
                </p>
              </div>
              <div className="text-right shrink-0">
                {exp.actualAmount != null && (
                  <p className="text-body-md font-semibold text-primary">{formatPrice(exp.actualAmount, exp.currency)}</p>
                )}
                {exp.estimatedAmount != null && (
                  <p className="text-body-sm text-secondary">Est. {formatPrice(exp.estimatedAmount, exp.currency)}</p>
                )}
              </div>
              <div className="flex gap-1 shrink-0">
                <button onClick={() => openEdit(exp)} className="btn-icon"><span className="material-symbols-outlined text-[18px]">edit</span></button>
                <button onClick={() => handleDelete(exp.id)} className="btn-icon text-error"><span className="material-symbols-outlined text-[18px]">delete</span></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal isOpen={showModal} onClose={() => { setShowModal(false); resetForm(); }} title={editingExpense ? 'Edit Expense' : 'Add Expense'}>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="input-label">Title *</label>
            <input className="input" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />
          </div>
          <div>
            <label className="input-label">Category</label>
            <select className="input" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
              {EXPENSE_CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.icon} {c.label}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="input-label">Estimated</label>
              <input type="number" className="input" value={form.estimatedAmount} onChange={e => setForm(f => ({ ...f, estimatedAmount: e.target.value }))} min="0" step="0.01" />
            </div>
            <div>
              <label className="input-label">Actual</label>
              <input type="number" className="input" value={form.actualAmount} onChange={e => setForm(f => ({ ...f, actualAmount: e.target.value }))} min="0" step="0.01" />
            </div>
          </div>
          <div>
            <label className="input-label">Date</label>
            <input type="date" className="input" value={form.expenseDate} onChange={e => setForm(f => ({ ...f, expenseDate: e.target.value }))} />
          </div>
          <div>
            <label className="input-label">Notes</label>
            <textarea className="input" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={2} />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => { setShowModal(false); resetForm(); }} className="btn btn-ghost">Cancel</button>
            <button type="submit" className="btn btn-primary">{editingExpense ? 'Save Changes' : 'Add Expense'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
