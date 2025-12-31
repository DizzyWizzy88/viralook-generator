export default function CancelPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white bg-black text-center">
      <h1 className="text-4xl font-bold mb-4">Payment Cancelled</h1>
      <p>No worries! Your account hasn't been charged.</p>
      <a href="/dashboard" className="mt-6 text-gray-400 underline">Return to pricing</a>
    </div>
  );
}
