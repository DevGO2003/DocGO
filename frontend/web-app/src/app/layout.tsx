import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import '@/styles/animations.css'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from '@/hooks/useAuth'
import { LoadingProvider } from '@/components/LoadingProvider'
import { PageTransition } from '@/components/PageTransition'
import { I18nProvider } from '@/components/I18nProvider'
import StickyFixGlobal from '@/components/StickyFixGlobal'
import GlobalErrorSummary from '@/components/GlobalErrorSummary'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: 'DocGO - Quản lý tài liệu và hợp đồng thông minh',
  description: 'Nền tảng quản lý tài liệu và hợp đồng thông minh, giúp doanh nghiệp tối ưu hóa quy trình làm việc và tăng hiệu quả kinh doanh.',
  keywords: 'quản lý tài liệu, hợp đồng, AI, tự động hóa, doanh nghiệp',
  authors: [{ name: 'DevGO2003' }],
  creator: 'DevGO2003',
  publisher: 'DevGO2003',
  robots: 'index, follow',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: 'DocGO - Quản lý tài liệu và hợp đồng thông minh',
    description: 'Nền tảng quản lý tài liệu và hợp đồng thông minh, giúp doanh nghiệp tối ưu hóa quy trình làm việc.',
    type: 'website',
    locale: 'vi_VN',
    siteName: 'DocGO',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'DocGO - Quản lý tài liệu và hợp đồng thông minh',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DocGO - Quản lý tài liệu và hợp đồng thông minh',
    description: 'Nền tảng quản lý tài liệu và hợp đồng thông minh, giúp doanh nghiệp tối ưu hóa quy trình làm việc.',
    images: ['/og-image.png'],
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#2563eb',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        {/* Global error handler */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.addEventListener('unhandledrejection', function(event) {
                console.error('Unhandled promise rejection:', event.reason);
                // Có thể thêm logic xử lý lỗi tại đây
              });
              
              window.addEventListener('error', function(event) {
                console.error('Global error:', event.error);
                // Có thể thêm logic xử lý lỗi tại đây
              });
            `,
          }}
        />
        <I18nProvider>
          <LoadingProvider>
            <AuthProvider>
              <PageTransition>
                {children}
              </PageTransition>
              <Toaster 
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: '#363636',
                    color: '#fff',
                  },
                  success: {
                    duration: 3000,
                    iconTheme: {
                      primary: '#10b981',
                      secondary: '#fff',
                    },
                  },
                  error: {
                    duration: 5000,
                    iconTheme: {
                      primary: '#ef4444',
                      secondary: '#fff',
                    },
                  },
                }}
              />
              <GlobalErrorSummary />
              <StickyFixGlobal />
            </AuthProvider>
          </LoadingProvider>
        </I18nProvider>
      </body>
    </html>
  )
}
