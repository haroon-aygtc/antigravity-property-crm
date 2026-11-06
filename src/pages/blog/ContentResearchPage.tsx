import { useState, useEffect } from 'react';
import { RefreshCw, Plus, TrendingUp, Globe, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ContentTopic {
  id: string;
  title: string;
  description: string;
  keywords: string[];
  sourceUrls: string[];
  noveltyScore: number;
  trendingScore: number;
  menaRelevance: number;
  status: 'PENDING' | 'RESEARCHING' | 'READY' | 'GENERATING' | 'COMPLETED' | 'FAILED';
  createdAt: string;
}

interface ContentSource {
  id: string;
  name: string;
  type: string;
  url: string;
  enabled: boolean;
  priority: number;
  lastFetchedAt?: string;
}

export default function ContentResearchPage() {
  const [topics, setTopics] = useState<ContentTopic[]>([]);
  const [sources, setSources] = useState<ContentSource[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTopics();
    fetchSources();
  }, []);

  const fetchTopics = async () => {
    try {
      const response = await fetch('/api/content-topics');
      const data = await response.json();
      setTopics(data.topics);
    } catch (error) {
      console.error('Failed to fetch topics:', error);
    }
  };

  const fetchSources = async () => {
    try {
      const response = await fetch('/api/content-sources');
      const data = await response.json();
      setSources(data);
    } catch (error) {
      console.error('Failed to fetch sources:', error);
    }
  };

  const handleResearch = async () => {
    setLoading(true);
    try {
      await fetch('/api/batch-jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'CONTENT_RESEARCH',
          scheduledFor: new Date().toISOString(),
        }),
      });
      
      setTimeout(fetchTopics, 2000);
    } catch (error) {
      console.error('Failed to start research:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async (topicId: string) => {
    try {
      await fetch('/api/batch-jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'ARTICLE_GENERATION',
          scheduledFor: new Date().toISOString(),
          data: { topicId },
        }),
      });

      setTopics(topics.map(t => 
        t.id === topicId ? { ...t, status: 'GENERATING' as const } : t
      ));
    } catch (error) {
      console.error('Failed to generate article:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-500';
      case 'READY': return 'bg-blue-500';
      case 'GENERATING': return 'bg-purple-500';
      case 'RESEARCHING': return 'bg-yellow-500';
      case 'FAILED': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Content Research</h1>
          <p className="text-muted-foreground">Discover trending topics and generate articles</p>
        </div>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Add Source
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Content Source</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input placeholder="Source name" />
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Source type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="RSS">RSS Feed</SelectItem>
                    <SelectItem value="NEWS_API">News API</SelectItem>
                    <SelectItem value="REDDIT">Reddit</SelectItem>
                    <SelectItem value="TWITTER">Twitter</SelectItem>
                  </SelectContent>
                </Select>
                <Input placeholder="URL" />
                <Input placeholder="API Key (if required)" type="password" />
                <Button className="w-full">Add Source</Button>
              </div>
            </DialogContent>
          </Dialog>
          <Button onClick={handleResearch} disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Research Topics
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Active Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{sources.filter(s => s.enabled).length}</div>
            <p className="text-xs text-muted-foreground">of {sources.length} total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Ready Topics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {topics.filter(t => t.status === 'READY').length}
            </div>
            <p className="text-xs text-muted-foreground">awaiting generation</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {topics.filter(t => t.status === 'COMPLETED').length}
            </div>
            <p className="text-xs text-muted-foreground">articles generated</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Content Sources</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {sources.map((source) => (
              <div key={source.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  {source.enabled ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-gray-400" />
                  )}
                  <div>
                    <div className="font-medium">{source.name}</div>
                    <div className="text-sm text-muted-foreground">{source.type}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant="outline">Priority: {source.priority}</Badge>
                  {source.lastFetchedAt && (
                    <span className="text-xs text-muted-foreground">
                      Last: {new Date(source.lastFetchedAt).toLocaleString()}
                    </span>
                  )}
                  <Button variant="ghost" size="sm">Edit</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Discovered Topics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topics.map((topic) => (
              <div key={topic.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{topic.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{topic.description}</p>
                  </div>
                  <Badge className={getStatusColor(topic.status)}>
                    {topic.status}
                  </Badge>
                </div>

                <div className="flex gap-2 flex-wrap">
                  {topic.keywords.slice(0, 5).map((keyword) => (
                    <Badge key={keyword} variant="secondary">
                      {keyword}
                    </Badge>
                  ))}
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Novelty</div>
                    <Progress value={topic.noveltyScore * 100} className="h-2" />
                    <div className="text-xs mt-1">{Math.round(topic.noveltyScore * 100)}%</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Trending</div>
                    <Progress value={topic.trendingScore * 100} className="h-2" />
                    <div className="text-xs mt-1">{Math.round(topic.trendingScore * 100)}%</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">MENA Relevance</div>
                    <Progress value={topic.menaRelevance * 100} className="h-2" />
                    <div className="text-xs mt-1">{Math.round(topic.menaRelevance * 100)}%</div>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <div className="text-xs text-muted-foreground">
                    {topic.sourceUrls.length} source{topic.sourceUrls.length !== 1 ? 's' : ''}
                  </div>
                  {topic.status === 'READY' && (
                    <Button onClick={() => handleGenerate(topic.id)}>
                      Generate Article
                    </Button>
                  )}
                  {topic.status === 'COMPLETED' && (
                    <Button variant="outline">View Article</Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
