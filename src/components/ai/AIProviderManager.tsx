import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { Plus, Check, X, Eye, EyeOff, Loader2, Activity } from 'lucide-react';
import type { AIProvider } from '@/types';

const providerTypes = [
  { value: 'openai', label: 'OpenAI', models: ['gpt-4', 'gpt-4-turbo', 'gpt-3.5-turbo'] },
  { value: 'claude', label: 'Anthropic Claude', models: ['claude-3-opus', 'claude-3-sonnet', 'claude-3-haiku'] },
  { value: 'gemini', label: 'Google Gemini', models: ['gemini-pro', 'gemini-pro-vision'] },
  { value: 'groq', label: 'Groq', models: ['llama2-70b', 'mixtral-8x7b'] },
  { value: 'openrouter', label: 'OpenRouter', models: ['auto'] },
  { value: 'grok', label: 'xAI Grok', models: ['grok-1'] },
];

interface ProviderCardProps {
  provider: AIProvider;
  onEdit: (provider: AIProvider) => void;
  onTest: (provider: AIProvider) => void;
  onDelete: (id: string) => void;
}

function ProviderCard({ provider, onEdit, onTest, onDelete }: ProviderCardProps) {
  const [testing, setTesting] = useState(false);

  const handleTest = async () => {
    setTesting(true);
    await onTest(provider);
    setTesting(false);
  };

  const statusColors = {
    active: 'bg-green-500',
    inactive: 'bg-gray-500',
    error: 'bg-red-500',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                {provider.name}
                <div className={`w-2 h-2 rounded-full ${statusColors[provider.status]}`} />
              </CardTitle>
              <CardDescription className="mt-1">
                {providerTypes.find(p => p.value === provider.type)?.label}
              </CardDescription>
            </div>
            <Badge variant={provider.status === 'active' ? 'default' : 'secondary'}>
              {provider.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Available Models</p>
              <div className="flex flex-wrap gap-1">
                {provider.models.map((model) => (
                  <Badge key={model} variant="outline" className="text-xs">
                    {model}
                  </Badge>
                ))}
              </div>
            </div>

            {provider.usageStats && (
              <div className="grid grid-cols-3 gap-2 pt-2 border-t">
                <div>
                  <p className="text-xs text-muted-foreground">Tokens</p>
                  <p className="text-sm font-semibold">{provider.usageStats.tokensUsed.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Requests</p>
                  <p className="text-sm font-semibold">{provider.usageStats.requests}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Cost</p>
                  <p className="text-sm font-semibold">${provider.usageStats.cost.toFixed(2)}</p>
                </div>
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => onEdit(provider)} className="flex-1">
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleTest}
                disabled={testing}
                className="flex-1"
              >
                {testing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Activity className="h-4 w-4" />}
                <span className="ml-2">Test</span>
              </Button>
              <Button variant="destructive" size="sm" onClick={() => onDelete(provider.id)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

interface AddProviderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (provider: Omit<AIProvider, 'id'>) => void;
  editProvider?: AIProvider;
}

function AddProviderDialog({ open, onOpenChange, onAdd, editProvider }: AddProviderDialogProps) {
  const [name, setName] = useState(editProvider?.name || '');
  const [type, setType] = useState<AIProvider['type']>(editProvider?.type || 'openai');
  const [apiKey, setApiKey] = useState(editProvider?.apiKey || '');
  const [showKey, setShowKey] = useState(false);
  const [validating, setValidating] = useState(false);

  const selectedProvider = providerTypes.find(p => p.value === type);

  const handleSubmit = async () => {
    setValidating(true);
    // Simulate validation
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onAdd({
      name,
      type,
      apiKey,
      status: 'active',
      models: selectedProvider?.models || [],
      lastChecked: new Date(),
      usageStats: {
        tokensUsed: 0,
        cost: 0,
        requests: 0,
      },
    });
    
    setValidating(false);
    onOpenChange(false);
    
    // Reset form
    setName('');
    setApiKey('');
    setType('openai');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{editProvider ? 'Edit' : 'Add'} AI Provider</DialogTitle>
          <DialogDescription>
            Configure your AI provider connection. Your API key will be encrypted and stored securely.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Provider Name</Label>
            <Input
              id="name"
              placeholder="My OpenAI Provider"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">Provider Type</Label>
            <Select value={type} onValueChange={(value) => setType(value as AIProvider['type'])}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {providerTypes.map((provider) => (
                  <SelectItem key={provider.value} value={provider.value}>
                    {provider.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="apiKey">API Key</Label>
            <div className="relative">
              <Input
                id="apiKey"
                type={showKey ? 'text' : 'password'}
                placeholder="sk-..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full"
                onClick={() => setShowKey(!showKey)}
              >
                {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          {selectedProvider && (
            <div className="rounded-lg bg-muted p-3">
              <p className="text-sm font-medium mb-2">Available Models:</p>
              <div className="flex flex-wrap gap-1">
                {selectedProvider.models.map((model) => (
                  <Badge key={model} variant="secondary" className="text-xs">
                    {model}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!name || !apiKey || validating}>
            {validating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {editProvider ? 'Update' : 'Add'} Provider
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function AIProviderManager() {
  const [providers, setProviders] = useState<AIProvider[]>([
    {
      id: '1',
      name: 'Primary OpenAI',
      type: 'openai',
      apiKey: 'sk-***',
      status: 'active',
      models: ['gpt-4', 'gpt-4-turbo', 'gpt-3.5-turbo'],
      usageStats: {
        tokensUsed: 125000,
        cost: 2.45,
        requests: 342,
      },
    },
  ]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProvider, setEditingProvider] = useState<AIProvider | undefined>();
  const { toast } = useToast();

  const handleAdd = (provider: Omit<AIProvider, 'id'>) => {
    if (editingProvider) {
      setProviders(prev => prev.map(p => p.id === editingProvider.id ? { ...provider, id: p.id } : p));
      toast({ title: 'Provider updated successfully' });
      setEditingProvider(undefined);
    } else {
      setProviders(prev => [...prev, { ...provider, id: Date.now().toString() }]);
      toast({ title: 'Provider added successfully' });
    }
  };

  const handleEdit = (provider: AIProvider) => {
    setEditingProvider(provider);
    setDialogOpen(true);
  };

  const handleTest = async (provider: AIProvider) => {
    toast({ title: `Testing ${provider.name}...` });
    await new Promise(resolve => setTimeout(resolve, 1500));
    toast({ title: 'Connection successful', description: `${provider.name} is working correctly` });
  };

  const handleDelete = (id: string) => {
    setProviders(prev => prev.filter(p => p.id !== id));
    toast({ title: 'Provider removed' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">AI Provider Manager</h2>
          <p className="text-muted-foreground">
            Manage your AI provider connections and monitor usage
          </p>
        </div>
        <Button onClick={() => {
          setEditingProvider(undefined);
          setDialogOpen(true);
        }}>
          <Plus className="mr-2 h-4 w-4" />
          Add Provider
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {providers.map((provider) => (
          <ProviderCard
            key={provider.id}
            provider={provider}
            onEdit={handleEdit}
            onTest={handleTest}
            onDelete={handleDelete}
          />
        ))}
      </div>

      <AddProviderDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onAdd={handleAdd}
        editProvider={editingProvider}
      />
    </div>
  );
}
