import React, { useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();

  // Redirect to /swagger immediately
  useEffect(() => {
    router.push('/swagger');
  }, [router]);



  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
      <Head>
        <title>DocGO - Redirecting to Swagger</title>
        <meta name="description" content="Redirecting to Swagger UI" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-6 shadow-2xl animate-pulse">
            <span className="text-4xl">🚀</span>
          </div>
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              DocGO
          </h1>
        <p className="text-xl text-gray-600 mb-6">
          Đang chuyển hướng đến Swagger UI...
        </p>
        <div className="flex items-center justify-center space-x-2">
          <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-gray-500">Vui lòng chờ...</span>
            </div>
          </div>
    </div>
  );
}