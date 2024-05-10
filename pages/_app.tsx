import Loading from '@/shared/Loading';
import { Toaster } from '@/shared/Toaster';
import '@/styles/globals.scss';
import type { AppProps } from 'next/app';
import { lazy, Suspense } from 'react';
const FacebookSharing = lazy(() => import('../components/FacebookSharing'));

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Toaster />
      <Suspense fallback={<Loading />}>
        <FacebookSharing />
      </Suspense>
      {/* <Component {...pageProps} />; */}
    </>
  );
}
