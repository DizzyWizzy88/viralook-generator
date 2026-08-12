
interface CreditBadgeProps {
  credits: number;
  isUnlimited?: boolean;
  onUpgradeClick?: () => void;
}

export default function CreditBadge({
  credits,
  isUnlimited = false,
  onUpgradeClick
}: CreditBadgeProps) {
  // Hide the badge completely for Viral Legend / Unlimited subscribers
  if (isUnlimited) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={onUpgradeClick}
      className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 px-3 py-1.5 rounded-full transition-all cursor-pointer group"
    >
      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
      <span className="text-[11px] font-bold text-zinc-300 group-hover:text-white tracking-wider uppercase">
        {credits} {credits === 1 ? 'Credit' : 'Credits'}
      </span>
      <span className="text-[9px] font-black bg-white/10 group-hover:bg-white group-hover:text-black px-1.5 py-0.5 rounded transition-all text-zinc-400">
        +
      </span>
    </button>
  );
}