import React from 'react';

export interface CreditBadgeProps {
  credits: number;
  isUnlimited?: boolean;
  onUpgradeClick?: () => void;
}

export const CreditBadge: React.FC<CreditBadgeProps> = ({
  credits,
  isUnlimited = false,
  onUpgradeClick,
}) => {
  return (
    <div className="flex items-center gap-2 rounded-full bg-slate-800/80 px-3 py-1 text-sm text-slate-200 border border-slate-700">
      <span className="font-medium">
        {isUnlimited ? '∞ Unlimited Credits' : `${credits} Credits`}
      </span>
      {onUpgradeClick && (
        <button
          onClick={onUpgradeClick}
          type="button"
          className="ml-1 rounded-full bg-indigo-600 px-2.5 py-0.5 text-xs font-semibold text-white hover:bg-indigo-500 transition-colors"
        >
          Upgrade
        </button>
      )}
    </div>
  );
};

export default CreditBadge;