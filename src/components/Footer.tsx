import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t bg-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col items-center md:items-start">
            <span className="text-xl font-bold text-blue-600">Viralook</span>
            <p className="mt-2 text-sm text-gray-500">
              Professional AI photos in seconds.
            </p>
          </div>
          
          <div className="flex gap-8 text-sm text-gray-600">
            <Link href="/privacy" className="hover:text-blue-600 transition">Privacy</Link>
            <Link href="/terms" className="hover:text-blue-600 transition">Terms</Link>
            <Link href="mailto:support@viralook.com" className="hover:text-blue-600 transition">Contact</Link>
          </div>
          
          <div className="text-sm text-gray-400">
            © {new Date().getFullYear()} Viralook. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
