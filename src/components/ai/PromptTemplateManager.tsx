import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/components/ui/use-toast';
import { Plus, Edit, Trash2, Play, Copy, FileText } from 'lucide-react';
import type { PromptTemplate } from '@/types';

interface PromptTemplateCardProps {
  template: PromptTemplate;
  onEdit: (template: PromptTemplate) => void;
  onDelete: (id: string) => void;
  onTest: (template: PromptTemplate) => void;
}

function PromptTemplateCard({ template, onEdit, onDelete, onTest }: PromptTemplateCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
    >
      <Card className="hover:shadow-md transition-shadow cursor-pointer group">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg">{template.name}</CardTitle>
              <CardDescription className="mt-1">{template.description}</CardDescription>
            </div>
            <Badge variant="outline">v{template.version}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <FileText className="h-4 w-4" />
              <span>{template.aiProvider} • {template.model}</span>
            </div>
            
            {template.variables.length > 0 && (
              <div>
                <p className="text-xs text-muted-foreground mb-1">Variables:</p>
                <div className="flex flex-wrap gap-1">
                  {template.variables.map((variable) => (
                    <Badge key={variable} variant="secondary" className="text-xs">
                      {`{${variable}}`}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-2 pt-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button variant="outline" size="sm" onClick={() => onEdit(template)} className="flex-1">
                <Edit className="h-3 w-3 mr-1" />
                Edit
              </Button>
              <Button variant="outline" size="sm" onClick={() => onTest(template)} className="flex-1">
                <Play className="h-3 w-3 mr-1" />
                Test
              </Button>
              <Button variant="destructive" size="sm" onClick={() => onDelete(template.id)}>
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

interface PromptEditorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (template: Omit<PromptTemplate, 'id' | 'createdAt' | 'updatedAt'>) => void;
  editTemplate?: PromptTemplate;
}

function PromptEditorDialog({ open, onOpenChange, onSave, editTemplate }: PromptEditorDialogProps) {
  const [name, setName] = useState(editTemplate?.name || '');
  const [description, setDescription] = useState(editTemplate?.description || '');
  const [content, setContent] = useState(editTemplate?.content || '');
  const [aiProvider, setAiProvider] = useState(editTemplate?.aiProvider || 'OpenAI');
  const [model, setModel] = useState(editTemplate?.model || 'gpt-4');
  const [testResult, setTestResult] = useState('');
  const [testing, setTesting] = useState(false);

  const extractVariables = (text: string): string[] => {
    const matches = text.match(/\{([^}]+)\}/g);
    return matches ? matches.map(m => m.slice(1, -1)) : [];
  };

  const variables = extractVariables(content);

  const handleTest = async () => {
    setTesting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setTestResult('This is a sample AI response based on your prompt template. The actual response would come from the selected AI provider.');
    setTesting(false);
  };

  const handleSave = () => {
    onSave({
      name,
      description,
      content,
      variables,
      aiProvider,
      model,
      version: editTemplate ? editTemplate.version + 1 : 1,
    });
    onOpenChange(false);
  };

  const insertVariable = (variable: string) => {
    setContent(prev => prev + `{${variable}}`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{editTemplate ? 'Edit' : 'Create'} Prompt Template</DialogTitle>
          <DialogDescription>
            Design your prompt template with variables and test it before deployment
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="editor" className="flex-1">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="editor">Editor</TabsTrigger>
            <TabsTrigger value="test">Test Console</TabsTrigger>
          </TabsList>
          
          <TabsContent value="editor" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Template Name</Label>
                <Input
                  id="name"
                  placeholder="Property Description Generator"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="provider">AI Provider</Label>
                <Select value={aiProvider} onValueChange={setAiProvider}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="OpenAI">OpenAI</SelectItem>
                    <SelectItem value="Claude">Claude</SelectItem>
                    <SelectItem value="Gemini">Gemini</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  placeholder="Generates compelling property descriptions"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="model">Model</Label>
                <Select value={model} onValueChange={setModel}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gpt-4">GPT-4</SelectItem>
                    <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                    <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="content">Prompt Content</Label>
                <div className="flex gap-1">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => insertVariable('property_type')}
                  >
                    + property_type
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => insertVariable('location')}
                  >
                    + location
                  </Button>
                </div>
              </div>
              <Textarea
                id="content"
                placeholder="Write a compelling description for a {property_type} in {location}..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[200px] font-mono text-sm"
              />
            </div>

            {variables.length > 0 && (
              <div className="rounded-lg bg-muted p-3">
                <p className="text-sm font-medium mb-2">Detected Variables:</p>
                <div className="flex flex-wrap gap-1">
                  {variables.map((variable) => (
                    <Badge key={variable} variant="secondary">
                      {`{${variable}}`}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="test" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div className="flex gap-2">
                <Button onClick={handleTest} disabled={testing || !content}>
                  <Play className="mr-2 h-4 w-4" />
                  {testing ? 'Testing...' : 'Run Test'}
                </Button>
              </div>

              {testResult && (
                <div className="rounded-lg border bg-card p-4">
                  <p className="text-sm font-medium mb-2">AI Response:</p>
                  <ScrollArea className="h-[200px]">
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {testResult}
                    </p>
                  </ScrollArea>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!name || !content}>
            {editTemplate ? 'Update' : 'Save'} Template
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function PromptTemplateManager() {
  const [templates, setTemplates] = useState<PromptTemplate[]>([
    {
      id: '1',
      name: 'Property Description',
      description: 'Generate compelling property descriptions',
      content: 'Write a professional description for a {property_type} in {location} with {bedrooms} bedrooms.',
      variables: ['property_type', 'location', 'bedrooms'],
      aiProvider: 'OpenAI',
      model: 'gpt-4',
      version: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<PromptTemplate | undefined>();
  const { toast } = useToast();

  const handleSave = (template: Omit<PromptTemplate, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingTemplate) {
      setTemplates(prev => prev.map(t => 
        t.id === editingTemplate.id 
          ? { ...template, id: t.id, createdAt: t.createdAt, updatedAt: new Date() }
          : t
      ));
      toast({ title: 'Template updated successfully' });
      setEditingTemplate(undefined);
    } else {
      setTemplates(prev => [...prev, {
        ...template,
        id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
      }]);
      toast({ title: 'Template created successfully' });
    }
  };

  const handleEdit = (template: PromptTemplate) => {
    setEditingTemplate(template);
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setTemplates(prev => prev.filter(t => t.id !== id));
    toast({ title: 'Template deleted' });
  };

  const handleTest = (template: PromptTemplate) => {
    setEditingTemplate(template);
    setDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Prompt Templates</h2>
          <p className="text-muted-foreground">
            Create and manage reusable prompt templates with variables
          </p>
        </div>
        <Button onClick={() => {
          setEditingTemplate(undefined);
          setDialogOpen(true);
        }}>
          <Plus className="mr-2 h-4 w-4" />
          New Template
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {templates.map((template) => (
          <PromptTemplateCard
            key={template.id}
            template={template}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onTest={handleTest}
          />
        ))}
      </div>

      <PromptEditorDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={handleSave}
        editTemplate={editingTemplate}
      />
    </div>
  );
}
