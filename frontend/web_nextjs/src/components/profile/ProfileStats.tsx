'use client'

import { useTranslation } from '@/hooks/useTranslation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { 
  ChartBarIcon, 
  DocumentTextIcon, 
  ClockIcon, 
  CheckCircleIcon, 
  ArrowTrendingUpIcon, 
  UsersIcon, 
  CalendarIcon,
  BoltIcon,
  TagIcon,
  BoltIcon as ZapIcon
} from '@heroicons/react/24/outline'

interface StatCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  trend?: {
    value: number
    isPositive: boolean
  }
  description?: string
}

function StatCard({ title, value, icon, trend, description }: StatCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
            {description && (
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{description}</p>
            )}
          </div>
          <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
            {icon}
          </div>
        </div>
        {trend && (
          <div className="mt-4 flex items-center">
            <span className={`text-sm font-medium ${
              trend.isPositive ? 'text-green-600' : 'text-red-600'
            }`}>
              {trend.isPositive ? '+' : ''}{trend.value}%
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">vs last month</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export function ProfileStats() {
  const { t } = useTranslation()

  // Mock data - in real app, this would come from API
  const overviewStats = [
    {
      title: t('profile.stats.overview.totalContracts'),
      value: '24',
      icon: <DocumentTextIcon className="h-6 w-6 text-blue-600" />,
      trend: { value: 12, isPositive: true },
      description: 'Active contracts'
    },
    {
      title: t('profile.stats.overview.pendingApprovals'),
      value: '8',
      icon: <ClockIcon className="h-6 w-6 text-yellow-600" />,
      trend: { value: -5, isPositive: false },
      description: 'Awaiting your review'
    },
    {
      title: t('profile.stats.overview.completedTasks'),
      value: '156',
      icon: <CheckCircleIcon className="h-6 w-6 text-green-600" />,
      trend: { value: 8, isPositive: true },
      description: 'This month'
    },
    {
      title: t('profile.stats.overview.activeProjects'),
      value: '5',
      icon: <TagIcon className="h-6 w-6 text-purple-600" />,
      trend: { value: 2, isPositive: true },
      description: 'In progress'
    }
  ]

  const activityStats = [
    {
      title: t('profile.stats.activity.lastLogin'),
      value: '2 hours ago',
      icon: <CalendarIcon className="h-6 w-6 text-indigo-600" />,
      description: 'Last seen online'
    },
    {
      title: t('profile.stats.activity.documentsUploaded'),
      value: '47',
      icon: <DocumentTextIcon className="h-6 w-6 text-blue-600" />,
      trend: { value: 15, isPositive: true },
      description: 'This month'
    },
    {
      title: t('profile.stats.activity.contractsCreated'),
      value: '12',
      icon: <DocumentTextIcon className="h-6 w-6 text-green-600" />,
      trend: { value: 25, isPositive: true },
      description: 'This month'
    },
    {
      title: t('profile.stats.activity.approvalsProcessed'),
      value: '89',
      icon: <CheckCircleIcon className="h-6 w-6 text-orange-600" />,
      trend: { value: 5, isPositive: true },
      description: 'This month'
    }
  ]

  const performanceStats = [
    {
      title: t('profile.stats.performance.responseTime'),
      value: '2.3s',
      icon: <ZapIcon className="h-6 w-6 text-yellow-600" />,
      trend: { value: 10, isPositive: true },
      description: 'Average response time'
    },
    {
      title: t('profile.stats.performance.completionRate'),
      value: '94%',
      icon: <ArrowTrendingUpIcon className="h-6 w-6 text-green-600" />,
      trend: { value: 3, isPositive: true },
      description: 'Task completion rate'
    },
    {
      title: t('profile.stats.performance.accuracy'),
      value: '98.5%',
      icon: <TagIcon className="h-6 w-6 text-blue-600" />,
      trend: { value: 1, isPositive: true },
      description: 'Approval accuracy'
    },
    {
      title: t('profile.stats.performance.efficiency'),
      value: '87%',
      icon: <BoltIcon className="h-6 w-6 text-purple-600" />,
      trend: { value: 7, isPositive: true },
      description: 'Overall efficiency'
    }
  ]

  return (
    <div className="space-y-8">
      {/* Overview Stats */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {t('profile.stats.overview.title')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {overviewStats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>
      </div>

      {/* Activity Stats */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {t('profile.stats.activity.title')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {activityStats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>
      </div>

      {/* Performance Stats */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {t('profile.stats.performance.title')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {performanceStats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>
      </div>

      {/* Recent Activity Chart Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ChartBarIcon className="h-5 w-5" />
            Activity Over Time
          </CardTitle>
          <CardDescription>
            Your activity patterns over the last 30 days
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-gray-50 dark:bg-gray-800 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <ChartBarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                Chart visualization would go here
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                Integration with charting library needed
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Team Collaboration Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UsersIcon className="h-5 w-5" />
            Team Collaboration
          </CardTitle>
          <CardDescription>
            Your collaboration metrics with team members
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">23</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Team Members</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">156</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Comments Made</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">89%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Response Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
