import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import tripApi from '../services/tripApi';
import { CURRENCIES } from '../utils/constants';
import toast from 'react-hot-toast';

export default function CreateTrip() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    budget: '',
    currency: 'USD',
    coverImageUrl: '',
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Trip name is required.';
    if (!form.startDate) e.startDate = 'Start date is required.';
    if (!form.endDate) e.endDate = 'End date is required.';
    if (form.startDate && form.endDate && new Date(form.endDate) < new Date(form.startDate)) {
      e.endDate = 'End date must be after start date.';
    }
    if (form.budget && (isNaN(form.budget) || Number(form.budget) < 0)) {
      e.budget = 'Budget must be a positive number.';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const { data } = await tripApi.create({
        ...form,
        budget: form.budget ? Number(form.budget) : 0,
      });
      toast.success('Trip created!');
      navigate(`/trips/${data.data.trip.id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create trip.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[var(--spacing-container-max)] mx-auto px-[var(--spacing-margin-mobile)] md:px-[var(--spacing-margin-desktop)] py-[var(--spacing-stack-lg)]">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-headline-lg text-primary mb-2">Create New Trip</h1>
          <p className="text-body-lg text-secondary">Fill in the details to get started with your adventure.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Trip Name */}
          <div>
            <label className="input-label" htmlFor="name">Trip Name *</label>
            <input
              id="name"
              className={`input ${errors.name ? 'border-error' : ''}`}
              placeholder="e.g., Summer in Amalfi"
              value={form.name}
              onChange={(e) => handleChange('name', e.target.value)}
            />
            {errors.name && <p className="text-body-sm text-error mt-1">{errors.name}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="input-label" htmlFor="desc">Description</label>
            <textarea
              id="desc"
              className="input"
              placeholder="A brief description of your trip..."
              value={form.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={3}
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[var(--spacing-gutter)]">
            <div>
              <label className="input-label" htmlFor="startDate">Start Date *</label>
              <input
                id="startDate"
                type="date"
                className={`input ${errors.startDate ? 'border-error' : ''}`}
                value={form.startDate}
                onChange={(e) => handleChange('startDate', e.target.value)}
              />
              {errors.startDate && <p className="text-body-sm text-error mt-1">{errors.startDate}</p>}
            </div>
            <div>
              <label className="input-label" htmlFor="endDate">End Date *</label>
              <input
                id="endDate"
                type="date"
                className={`input ${errors.endDate ? 'border-error' : ''}`}
                value={form.endDate}
                onChange={(e) => handleChange('endDate', e.target.value)}
              />
              {errors.endDate && <p className="text-body-sm text-error mt-1">{errors.endDate}</p>}
            </div>
          </div>

          {/* Budget & Currency */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[var(--spacing-gutter)]">
            <div>
              <label className="input-label" htmlFor="budget">Budget</label>
              <input
                id="budget"
                type="number"
                className={`input ${errors.budget ? 'border-error' : ''}`}
                placeholder="0.00"
                value={form.budget}
                onChange={(e) => handleChange('budget', e.target.value)}
                min="0"
                step="0.01"
              />
              {errors.budget && <p className="text-body-sm text-error mt-1">{errors.budget}</p>}
            </div>
            <div>
              <label className="input-label" htmlFor="currency">Currency</label>
              <select
                id="currency"
                className="input"
                value={form.currency}
                onChange={(e) => handleChange('currency', e.target.value)}
              >
                {CURRENCIES.map(c => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Cover Image */}
          <div>
            <label className="input-label" htmlFor="cover">Cover Image URL</label>
            <input
              id="cover"
              className="input"
              placeholder="https://example.com/image.jpg"
              value={form.coverImageUrl}
              onChange={(e) => handleChange('coverImageUrl', e.target.value)}
            />
            {form.coverImageUrl && (
              <div className="mt-3 rounded-xl overflow-hidden h-48 bg-surface-container">
                <img
                  src={form.coverImageUrl}
                  alt="Cover preview"
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-surface-variant">
            <button type="button" onClick={() => navigate(-1)} className="btn btn-ghost">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn btn-primary">
              {loading ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                  Creating...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">add</span>
                  Create Trip
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
