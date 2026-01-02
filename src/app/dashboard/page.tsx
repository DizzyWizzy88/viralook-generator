import Generator from "@/components/Generator";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-extrabold text-center mb-8 text-gray-900">
          Viralook AI Studio
        </h1>
        
        {/* This is the line that was causing the error */}
        <Generator />
        
      </div>
    </main>
  );
}
