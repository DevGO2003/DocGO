export const metadata = {
  title: 'DocGO Web App',
  description: 'DocGO Frontend (webapp)'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}





