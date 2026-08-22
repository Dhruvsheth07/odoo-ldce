import { useState, useEffect } from 'react';
import { budgetApi } from '../../services/expenseApi';
import LoadingSkeleton from '../../components/common/Loader';
import ErrorState from '../../components/common/ErrorState';
import { formatPrice, getCategoryIcon, getCategoryColor } from '../../utils/formatters';
import { EXPENSE_CATEGORIES } from '../../utils/constants';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export default function BudgetOverview({ trip }) {
  const [budget, setBudget] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBudget = async () => {
    setLoading(true); setError(null);
    try {
      const { data } = await budgetApi.get(trip.id);
      setBudget(data?.data);
    } catch { setError('Failed to load budget.'); }
    setLoading(false);
  };

  useEffect(() => { fetchBudget(); }, [trip.id]);

  if (loading) return <LoadingSkeleton type="detail" />;
  if (error) return <ErrorState message={error} onRetry={fetchBudget} />;
  if (!budget) return <ErrorState title="No budget data" message="Add a budget and expenses to see analytics." />;

  const totalBudget = Number(budget.totalBudget || trip.budget || 0);
  const totalSpent = Number(budget.totalSpent || budget.totalActual || 0);
  const remaining = totalBudget - totalSpent;
  const percentUsed = totalBudget > 0 ? Math.min(100, (totalSpent / totalBudget) * 100) : 0;
  const isOverBudget = totalSpent > totalBudget && totalBudget > 0;

  // Category breakdown for pie chart
  const categoryData = (budget.categoryBreakdown || budget.categories || []).map(cat => ({
    name: EXPENSE_CATEGORIES.find(c => c.value === cat.category)?.label || cat.category,
    value: Number(cat.actual || cat.amount || 0),
    color: getCategoryColor(cat.category),
    icon: getCategoryIcon(cat.category),
  })).filter(c => c.value > 0);

  // Daily spending for bar chart
  const dailyData = (budget.dailySpending || budget.daily || []).map(d => ({
    date: d.date?.split('T')[0]?.slice(5) || d.label,
    amount: Number(d.amount || d.actual || 0),
  }));

  return (
    <div className="flex flex-col gap-[var(--spacing-stack-lg)]">
      {/* Budget Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-[var(--spacing-gutter)]">
        <div className="card p-6">
          <p className="text-label-caps text-secondary mb-2">Total Budget</p>
          <p className="text-headline-md text-primary">{formatPrice(totalBudget, trip.currency)}</p>
        </div>
        <div className="card p-6">
          <p className="text-label-caps text-secondary mb-2">Total Spent</p>
          <p className={`text-headline-md ${isOverBudget ? 'text-error' : 'text-primary'}`}>{formatPrice(totalSpent, trip.currency)}</p>
        </div>
        <div className="card p-6">
          <p className="text-label-caps text-secondary mb-2">Remaining</p>
          <p className={`text-headline-md ${remaining < 0 ? 'text-error' : 'text-primary'}`}>{formatPrice(remaining, trip.currency)}</p>
        </div>
        <div className="card p-6">
          <p className="text-label-caps text-secondary mb-2">Used</p>
          <p className={`text-headline-md ${isOverBudget ? 'text-error' : 'text-primary'}`}>{percentUsed.toFixed(0)}%</p>
          {/* Progress bar */}
          <div className="mt-3 h-2 bg-surface-container rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${isOverBudget ? 'bg-error' : 'bg-primary-container'}`}
              style={{ width: `${Math.min(100, percentUsed)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Over budget warning */}
      {isOverBudget && (
        <div className="bg-error-container text-on-error-container rounded-xl p-4 flex items-center gap-3">
          <span className="material-symbols-outlined text-[24px]">warning</span>
          <p className="text-body-md font-semibold">
            You are over budget by {formatPrice(Math.abs(remaining), trip.currency)}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-[var(--spacing-gutter)]">
        {/* Category Breakdown */}
        <div className="card p-6">
          <h3 className="text-headline-md text-primary mb-6">Spending by Category</h3>
          {categoryData.length > 0 ? (
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-48 h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={categoryData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={2}>
                      {categoryData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatPrice(value, trip.currency)} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-3 flex-grow">
                {categoryData.map((cat, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                    <span className="text-body-sm text-primary flex-grow">{cat.icon} {cat.name}</span>
                    <span className="text-body-sm font-semibold text-primary">{formatPrice(cat.value, trip.currency)}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-body-sm text-secondary">No spending data yet.</p>
          )}
        </div>

        {/* Daily Spending */}
        <div className="card p-6">
          <h3 className="text-headline-md text-primary mb-6">Daily Spending</h3>
          {dailyData.length > 0 ? (
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#c4c6cd" />
                  <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#74777d' }} />
                  <YAxis tick={{ fontSize: 12, fill: '#74777d' }} />
                  <Tooltip formatter={(value) => formatPrice(value, trip.currency)} />
                  <Bar dataKey="amount" fill="#1a2b3c" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-body-sm text-secondary">No daily spending data yet.</p>
          )}
        </div>
      </div>

      {/* Estimated vs Actual */}
      {budget.estimatedVsActual && (
        <div className="card p-6">
          <h3 className="text-headline-md text-primary mb-4">Estimated vs Actual</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-label-caps text-secondary mb-1">Total Estimated</p>
              <p className="text-body-lg font-semibold text-primary">{formatPrice(budget.estimatedVsActual.estimated, trip.currency)}</p>
            </div>
            <div>
              <p className="text-label-caps text-secondary mb-1">Total Actual</p>
              <p className="text-body-lg font-semibold text-primary">{formatPrice(budget.estimatedVsActual.actual, trip.currency)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
