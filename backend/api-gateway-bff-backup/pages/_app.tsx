import React, { useState, useEffect } from 'react';
import { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { FullPageLoading } from '../components/LoadingSpinner';

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleStart = (url: string) => {
      // Chỉ hiển thị loading cho navigation giữa các pages, không phải cho API routes
      if (url.startsWith('/api/')) return;
      setIsLoading(true);
    };

    const handleComplete = (url: string) => {
      // Chỉ ẩn loading cho navigation giữa các pages
      if (url.startsWith('/api/')) return;
      setIsLoading(false);
    };

    const handleError = () => {
      setIsLoading(false);
    };

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleError);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleError);
    };
  }, [router]);

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.svg" />
      </Head>
      
      {isLoading ? (
        <FullPageLoading text="Đang chuyển trang..." />
      ) : (
        <Component {...pageProps} />
      )}
    </>
  );
}

