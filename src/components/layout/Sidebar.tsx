import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Building2,
  Users,
  FileText,
  UserCircle,
  Briefcase,
  GitBranch,
  Brain,
  Settings,
  ChevronLeft,
  ChevronRight,
  Moon,
  Sun,
  Newspaper,
  Search,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useTheme } from '@/contexts/ThemeContext';

interface SidebarProps {
  className?: string;
}

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  {
    label: 'CMS',
    items: [
      { icon: Building2, label: 'Properties', path: '/cms/properties' },
      { icon: UserCircle, label: 'Agents', path: '/cms/agents' },
      { icon: FileText, label: 'Pages', path: '/cms/pages' },
    ]
  },
  {
    label: 'CRM',
    items: [
      { icon: Users, label: 'Leads', path: '/crm/leads' },
      { icon: Briefcase, label: 'Deals', path: '/crm/deals' },
      { icon: GitBranch, label: 'Pipeline', path: '/crm/pipeline' },
    ]
  },
  {
    label: 'Blog',
    items: [
      { icon: Newspaper, label: 'Posts', path: '/blog/posts' },
      { icon: Search, label: 'Research', path: '/blog/research' },
      { icon: Clock, label: 'Batch Jobs', path: '/blog/jobs' },
    ]
  },
  { icon: Brain, label: 'AI Control', path: '/ai-control' },
  { icon: Users, label: 'Users & Roles', path: '/users' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

export function Sidebar({ className }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  return (
    <div
      className={cn(
        'relative flex flex-col border-r bg-card transition-all duration-300',
        collapsed ? 'w-16' : 'w-64',
        className
      )}
    >
      <div className="flex h-16 items-center justify-between px-4 border-b">
        {!collapsed && (
          <h2 className="text-lg font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            RealEstate AI
          </h2>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-2">
          {menuItems.map((item, index) => {
            if ('items' in item) {
              return (
                <div key={index} className="space-y-1">
                  {!collapsed && (
                    <p className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      {item.label}
                    </p>
                  )}
                  {item.items.map((subItem) => (
                    <Link key={subItem.path} to={subItem.path}>
                      <Button
                        variant={location.pathname === subItem.path ? 'secondary' : 'ghost'}
                        className={cn(
                          'w-full justify-start',
                          collapsed && 'justify-center px-2'
                        )}
                      >
                        <subItem.icon className="h-4 w-4" />
                        {!collapsed && <span className="ml-3">{subItem.label}</span>}
                      </Button>
                    </Link>
                  ))}
                  {!collapsed && <Separator className="my-2" />}
                </div>
              );
            }

            return (
              <Link key={item.path} to={item.path}>
                <Button
                  variant={location.pathname === item.path ? 'secondary' : 'ghost'}
                  className={cn(
                    'w-full justify-start',
                    collapsed && 'justify-center px-2'
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {!collapsed && <span className="ml-3">{item.label}</span>}
                </Button>
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      <div className="border-t p-3">
        <Button
          variant="ghost"
          size={collapsed ? 'icon' : 'default'}
          onClick={toggleTheme}
          className={cn('w-full', !collapsed && 'justify-start')}
        >
          {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          {!collapsed && <span className="ml-3">Toggle Theme</span>}
        </Button>
      </div>
    </div>
  );
}
