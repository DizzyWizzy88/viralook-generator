"use client";

interface CreditBadgeProps {
  credits: number;
}

export default function CreditBadge({ credits }: CreditBadgeProps) {
  return (
    <div className="flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 px-4 py-2 rounded-full">
      <span className="text-blue-400 font-bold">{credits}</span>
      <span className="text-blue-400/70 text-sm uppercase tracking-wider">Credits</span>
    </div>
  );
}
