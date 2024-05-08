import { Inter } from 'next/font/google';
import { lazy, Suspense } from 'react';
import Loading from './shared/Loading';

const inter = Inter({ subsets: ['latin'] });

const FacebookSharing = lazy(() => import('./components/FacebookSharing'));
export default function Home() {
  return (
    <Suspense fallback={<Loading />}>
      <FacebookSharing />
    </Suspense>
  );
}
