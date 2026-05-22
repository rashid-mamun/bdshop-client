import { Link, useRouteError } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';

export function ErrorBoundary() {
  const error = useRouteError() as Error | undefined;

  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-[#f8f9fa] px-6 py-16 text-center">
      <div className="max-w-md rounded-3xl border border-red-100 bg-white p-8 shadow-sm">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-600">
          <AlertTriangle className="h-8 w-8" />
        </div>
        <h1 className="text-2xl font-black text-gray-900">Something went wrong</h1>
        <p className="mt-2 text-sm leading-6 text-gray-500">
          {error?.message || 'The page could not be loaded. Please try again.'}
        </p>
        <Link to="/" className="mt-6 inline-flex rounded-xl bg-[#1a8a4a] px-6 py-3 text-sm font-bold text-white hover:bg-[#157a3f]">
          Back to home
        </Link>
      </div>
    </div>
  );
}
