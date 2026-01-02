import Generator from "@/components/Generator";
import CreditBadge from "@/components/CreditBadge";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto flex flex-col items-center space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
            Viralook AI Studio
          </h1>
          {/* THE NEW BADGE */}
          <CreditBadge />
        </div>
        
        <Generator />
      </div>
    </main>
  );
}
