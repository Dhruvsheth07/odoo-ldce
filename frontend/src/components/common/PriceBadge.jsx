import { formatPrice, getPriceLabel, getPriceClass } from '../../utils/formatters';

export default function PriceBadge({ price, currency, priceType, className = '' }) {
  if (priceType === 'UNAVAILABLE' || (price === null && priceType !== 'UNAVAILABLE')) {
    return <span className={`text-xs text-slate-500 ${className}`}>Price unavailable</span>;
  }

  const label = getPriceLabel(priceType);
  const colorClass = getPriceClass(priceType);

  return (
    <span className={`font-semibold ${colorClass} ${className}`}>
      {label && <span className="text-xs opacity-75 mr-1">{label}</span>}
      {formatPrice(price, currency)}
    </span>
  );
}
