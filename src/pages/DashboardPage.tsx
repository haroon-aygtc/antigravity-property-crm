import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { TrendingUp, Users, DollarSign, Zap, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const metrics = [
  {
    title: 'Total Leads',
    value: '2,543',
    change: '+12.5%',
    trend: 'up',
    icon: Users,
    color: 'text-blue-600',
  },
  {
    title: 'Conversion Rate',
    value: '24.8%',
    change: '+4.2%',
    trend: 'up',
    icon: TrendingUp,
    color: 'text-green-600',
  },
  {
    title: 'AI Token Usage',
    value: '125K',
    change: '-8.1%',
    trend: 'down',
    icon: Zap,
    color: 'text-purple-600',
  },
  {
    title: 'Revenue',
    value: '$45.2K',
    change: '+18.3%',
    trend: 'up',
    icon: DollarSign,
    color: 'text-emerald-600',
  },
];

const topAgents = [
  { name: 'Sarah Johnson', deals: 23, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah' },
  { name: 'Michael Chen', deals: 19, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael' },
  { name: 'Emily Davis', deals: 17, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily' },
  { name: 'James Wilson', deals: 15, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James' },
];

const recentActivity = [
  { action: 'New lead added', user: 'Sarah Johnson', time: '2 minutes ago', type: 'lead' },
  { action: 'Deal closed', user: 'Michael Chen', time: '15 minutes ago', type: 'deal' },
  { action: 'Property listed', user: 'Emily Davis', time: '1 hour ago', type: 'property' },
  { action: 'AI description generated', user: 'System', time: '2 hours ago', type: 'ai' },
];

export default function DashboardPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Welcome back! Here's what's happening with your real estate business.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
                  <metric.icon className={`h-4 w-4 ${metric.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metric.value}</div>
                  <div className="flex items-center text-xs mt-1">
                    {metric.trend === 'up' ? (
                      <ArrowUpRight className="h-3 w-3 text-green-600 mr-1" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3 text-red-600 mr-1" />
                    )}
                    <span className={metric.trend === 'up' ? 'text-green-600' : 'text-red-600'}>
                      {metric.change}
                    </span>
                    <span className="text-muted-foreground ml-1">from last month</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Agents</CardTitle>
              <CardDescription>Based on closed deals this month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topAgents.map((agent, index) => (
                  <motion.div
                    key={agent.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={agent.avatar}
                          alt={agent.name}
                          className="h-10 w-10 rounded-full"
                        />
                        <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">
                          {index + 1}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium">{agent.name}</p>
                        <p className="text-xs text-muted-foreground">{agent.deals} deals closed</p>
                      </div>
                    </div>
                    <Badge variant="secondary">{agent.deals}</Badge>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest updates across the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <div className={`h-2 w-2 rounded-full mt-2 ${
                      activity.type === 'lead' ? 'bg-blue-500' :
                      activity.type === 'deal' ? 'bg-green-500' :
                      activity.type === 'property' ? 'bg-purple-500' :
                      'bg-orange-500'
                    }`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">
                        {activity.user} • {activity.time}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
