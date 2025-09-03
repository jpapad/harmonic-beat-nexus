import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  Music, 
  Layers3, 
  ListMusic, 
  Shuffle, 
  Settings, 
  BarChart3,
  Headphones,
  Disc3
} from 'lucide-react';

interface DJLayoutProps {
  children: React.ReactNode;
  activeSection?: string;
  onSectionChange?: (section: string) => void;
}

const DJLayout: React.FC<DJLayoutProps> = ({ 
  children, 
  activeSection = 'dashboard',
  onSectionChange 
}) => {
  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'analyzer', label: 'Analyzer', icon: Music },
    { id: 'playlists', label: 'Playlists', icon: ListMusic },
    { id: 'set-builder', label: 'Set Builder', icon: Layers3 },
    { id: 'library', label: 'Library', icon: Disc3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-surface/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="flex h-16 items-center px-6">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent">
              <Headphones className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                DJ Suite
              </h1>
              <p className="text-xs text-muted-foreground">Harmonic Mixing Tools</p>
            </div>
          </div>
          
          <div className="ml-auto flex items-center space-x-4">
            <Button variant="outline" size="sm" className="text-xs">
              Connect Spotify
            </Button>
            <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30" />
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar Navigation */}
        <aside className="w-64 border-r border-border bg-surface/30 min-h-[calc(100vh-4rem)]">
          <nav className="p-4 space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              
              return (
                <Button
                  key={item.id}
                  variant={isActive ? "secondary" : "ghost"}
                  className={`w-full justify-start gap-3 ${
                    isActive 
                      ? "bg-primary/10 text-primary border-primary/20" 
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  onClick={() => onSectionChange?.(item.id)}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DJLayout;