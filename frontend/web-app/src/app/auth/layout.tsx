import { AuthLayout } from '@/components/layout'

export const metadata = {
  title: 'DocGO - Authentication',
  description: 'DocGO Authentication Pages',
}

export default function AuthLayoutWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthLayout>
      {children}
    </AuthLayout>
  )
}