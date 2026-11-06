export type UserRole = 'admin' | 'manager' | 'agent' | 'viewer';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  avatar?: string;
}

export interface AIProvider {
  id: string;
  name: string;
  type: 'openai' | 'claude' | 'gemini' | 'groq' | 'openrouter' | 'grok';
  apiKey: string;
  status: 'active' | 'inactive' | 'error';
  models: string[];
  lastChecked?: Date;
  usageStats?: {
    tokensUsed: number;
    cost: number;
    requests: number;
  };
}

export interface PromptTemplate {
  id: string;
  name: string;
  description: string;
  content: string;
  variables: string[];
  aiProvider: string;
  model: string;
  version: number;
  createdAt: Date;
  updatedAt: Date;
  assignedTo?: string;
}

export interface DashboardMetrics {
  totalLeads: number;
  conversionRate: number;
  aiTokenUsage: number;
  topAgents: Array<{
    name: string;
    deals: number;
  }>;
}

export interface AuditLog {
  id: string;
  timestamp: Date;
  userId: string;
  action: string;
  module: 'cms' | 'crm' | 'ai' | 'users';
  details: string;
}
