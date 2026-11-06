import { useState, useEffect } from 'react';
import { Play, RefreshCw, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface BatchJob {
  id: string;
  type: 'CONTENT_RESEARCH' | 'ARTICLE_GENERATION' | 'QUALITY_CHECK' | 'PUBLISH' | 'SOCIAL_DISTRIBUTION';
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'RETRYING';
  scheduledFor: string;
  startedAt?: string;
  completedAt?: string;
  data?: any;
  result?: any;
  errorMessage?: string;
  retryCount: number;
  createdAt: string;
}

export default function BatchJobsPage() {
  const [jobs, setJobs] = useState<BatchJob[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
    const interval = setInterval(fetchJobs, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await fetch('/api/batch-jobs');
      const data = await response.json();
      setJobs(data.jobs);
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = async (jobId: string) => {
    try {
      await fetch(`/api/batch-jobs/${jobId}/retry`, { method: 'POST' });
      fetchJobs();
    } catch (error) {
      console.error('Failed to retry job:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'FAILED':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'RUNNING':
        return <RefreshCw className="h-5 w-5 text-blue-500 animate-spin" />;
      case 'PENDING':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'RETRYING':
        return <AlertCircle className="h-5 w-5 text-orange-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-500';
      case 'FAILED': return 'bg-red-500';
      case 'RUNNING': return 'bg-blue-500';
      case 'PENDING': return 'bg-yellow-500';
      case 'RETRYING': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeLabel = (type: string) => {
    return type.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  const filterJobsByStatus = (status: string) => {
    if (status === 'all') return jobs;
    return jobs.filter(job => job.status === status);
  };

  const stats = {
    total: jobs.length,
    completed: jobs.filter(j => j.status === 'COMPLETED').length,
    failed: jobs.filter(j => j.status === 'FAILED').length,
    running: jobs.filter(j => j.status === 'RUNNING').length,
    pending: jobs.filter(j => j.status === 'PENDING').length,
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Batch Jobs</h1>
          <p className="text-muted-foreground">Monitor automated content processing tasks</p>
        </div>
        <Button onClick={fetchJobs}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Running</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.running}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Failed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.failed}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All ({stats.total})</TabsTrigger>
          <TabsTrigger value="RUNNING">Running ({stats.running})</TabsTrigger>
          <TabsTrigger value="PENDING">Pending ({stats.pending})</TabsTrigger>
          <TabsTrigger value="COMPLETED">Completed ({stats.completed})</TabsTrigger>
          <TabsTrigger value="FAILED">Failed ({stats.failed})</TabsTrigger>
        </TabsList>

        {['all', 'RUNNING', 'PENDING', 'COMPLETED', 'FAILED'].map((status) => (
          <TabsContent key={status} value={status} className="mt-6">
            <Card>
              <CardContent className="p-0">
                <div className="divide-y">
                  {filterJobsByStatus(status).map((job) => (
                    <div key={job.id} className="p-4 hover:bg-muted/50">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          {getStatusIcon(job.status)}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold">{getTypeLabel(job.type)}</h3>
                              <Badge className={getStatusColor(job.status)}>
                                {job.status}
                              </Badge>
                              {job.retryCount > 0 && (
                                <Badge variant="outline">
                                  Retry {job.retryCount}
                                </Badge>
                              )}
                            </div>
                            
                            <div className="text-sm text-muted-foreground space-y-1">
                              <div>
                                Scheduled: {new Date(job.scheduledFor).toLocaleString()}
                              </div>
                              {job.startedAt && (
                                <div>
                                  Started: {new Date(job.startedAt).toLocaleString()}
                                </div>
                              )}
                              {job.completedAt && (
                                <div>
                                  Completed: {new Date(job.completedAt).toLocaleString()}
                                  {job.startedAt && (
                                    <span className="ml-2">
                                      ({Math.round((new Date(job.completedAt).getTime() - new Date(job.startedAt).getTime()) / 1000)}s)
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>

                            {job.errorMessage && (
                              <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                                {job.errorMessage}
                              </div>
                            )}

                            {job.result && (
                              <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-sm">
                                <pre className="text-xs overflow-auto">
                                  {JSON.stringify(job.result, null, 2)}
                                </pre>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex gap-2">
                          {job.status === 'FAILED' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleRetry(job.id)}
                            >
                              <Play className="mr-1 h-3 w-3" />
                              Retry
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {filterJobsByStatus(status).length === 0 && (
                    <div className="p-8 text-center text-muted-foreground">
                      No jobs found
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
