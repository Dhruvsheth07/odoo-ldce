import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../stores/useAuthStore';
import { userApi, savedApi } from '../services/expenseApi';
import { CURRENCIES } from '../utils/constants';
import ConfirmDialog from '../components/common/ConfirmDialog';
import toast from 'react-hot-toast';

export default function Profile() {
  const { user, updateUser, logout } = useAuthStore();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', preferredCurrency: 'USD', preferredLanguage: 'en' });
  const [savedDestinations, setSavedDestinations] = useState([]);
  const [saving, setSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        email: user.email || '',
        preferredCurrency: user.preferredCurrency || 'USD',
        preferredLanguage: user.preferredLanguage || 'en',
      });
    }
    fetchSaved();
  }, [user]);

  const fetchSaved = async () => {
    try {
      const { data } = await savedApi.getAll();
      setSavedDestinations(data?.data || []);
    } catch { /* empty */ }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await userApi.updateProfile({ name: form.name, preferredCurrency: form.preferredCurrency, preferredLanguage: form.preferredLanguage });
      updateUser(data?.data?.user);
      toast.success('Profile updated.');
    } catch {
      toast.error('Failed to update profile.');
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    try {
      await userApi.deleteAccount();
      logout();
      toast.success('Account deleted.');
      navigate('/login');
    } catch {
      toast.error('Failed to delete account.');
    }
  };

  const handleUnsave = async (id) => {
    try {
      await savedApi.unsave(id);
      toast.success('Destination removed.');
      fetchSaved();
    } catch { toast.error('Failed to remove.'); }
  };

  return (
    <div className="max-w-[var(--spacing-container-max)] mx-auto px-[var(--spacing-margin-mobile)] md:px-[var(--spacing-margin-desktop)] py-[var(--spacing-stack-lg)]">
      <div className="max-w-2xl mx-auto flex flex-col gap-[var(--spacing-stack-lg)]">
        <h1 className="text-headline-lg text-primary">Profile & Settings</h1>

        {/* Profile Form */}
        <div className="card p-8">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-20 h-20 rounded-full bg-primary-container text-on-primary flex items-center justify-center text-display-lg font-bold" style={{ fontSize: '32px' }}>
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div>
              <h2 className="text-headline-md text-primary">{user?.name}</h2>
              <p className="text-body-sm text-secondary">{user?.email}</p>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-5">
            <div>
              <label className="input-label">Full Name</label>
              <input className="input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
            </div>
            <div>
              <label className="input-label">Email</label>
              <input className="input" value={form.email} disabled />
              <p className="text-label-caps text-outline mt-1">Email cannot be changed.</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="input-label">Currency</label>
                <select className="input" value={form.preferredCurrency} onChange={e => setForm(f => ({ ...f, preferredCurrency: e.target.value }))}>
                  {CURRENCIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>
              <div>
                <label className="input-label">Language</label>
                <select className="input" value={form.preferredLanguage} onChange={e => setForm(f => ({ ...f, preferredLanguage: e.target.value }))}>
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                  <option value="de">Deutsch</option>
                </select>
              </div>
            </div>
            <button type="submit" disabled={saving} className="btn btn-primary">
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>

        {/* Saved Destinations */}
        <div className="card p-8">
          <h3 className="text-headline-md text-primary mb-4">Saved Destinations</h3>
          {savedDestinations.length > 0 ? (
            <div className="space-y-3">
              {savedDestinations.map(s => (
                <div key={s.id} className="flex items-center gap-4 py-3 border-b border-surface-variant last:border-0">
                  <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-secondary">location_on</span>
                  </div>
                  <div className="flex-grow min-w-0">
                    <p className="text-body-sm font-semibold text-primary truncate">{s.destination?.name}</p>
                    <p className="text-label-caps text-secondary">{s.destination?.country}</p>
                  </div>
                  <button onClick={() => handleUnsave(s.id)} className="btn-icon text-error">
                    <span className="material-symbols-outlined text-[18px]">bookmark_remove</span>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-body-sm text-secondary">No saved destinations.</p>
          )}
        </div>

        {/* Danger Zone */}
        <div className="card p-8 border-error/30">
          <h3 className="text-headline-md text-error mb-2">Danger Zone</h3>
          <p className="text-body-sm text-secondary mb-6">Deleting your account is permanent and cannot be undone.</p>
          <div className="flex gap-3">
            <button onClick={() => { logout(); navigate('/login'); }} className="btn btn-secondary">
              <span className="material-symbols-outlined text-[18px]">logout</span>
              Log Out
            </button>
            <button onClick={() => setShowDeleteConfirm(true)} className="btn btn-danger">
              <span className="material-symbols-outlined text-[18px]">delete_forever</span>
              Delete Account
            </button>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Delete Account"
        message="Are you sure you want to permanently delete your account? This action cannot be undone."
        confirmLabel="Delete Forever"
        danger
      />
    </div>
  );
}
