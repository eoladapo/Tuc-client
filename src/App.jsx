import { Suspense } from 'react';
import { RouterProvider } from 'react-router-dom';
import { QueryProvider } from './providers/QueryProvider';
import { router } from './routes';

/**
 * Shown only while a lazy route chunk downloads — deep-linking straight to a
 * dashboard URL, for instance. In-app navigation is wrapped in a transition by
 * react-router, so React keeps the current screen on display instead of
 * flashing this.
 */
const RouteFallback = () => (
  <div className="flex min-h-screen items-center justify-center bg-white">
    <div
      role="status"
      aria-label="Loading"
      className="h-10 w-10 animate-spin rounded-full border-b-2 border-primary-600"
    />
  </div>
);

function App() {
  return (
    <QueryProvider>
      {/* react-router's data router does not create its own Suspense boundary,
          so lazy routes need one above it. */}
      <Suspense fallback={<RouteFallback />}>
        <RouterProvider router={router} />
      </Suspense>
    </QueryProvider>
  );
}

export default App;
