import React, { useState } from 'react';
import DJLayout from '@/components/layout/DJLayout';
import ModernDashboardStats from '@/components/dashboard/ModernDashboardStats';
import ModernFileUpload from '@/components/analyzer/ModernFileUpload';
import { WaveformCard } from '@/components/ui/waveform-card';
import { DataTable } from '@/components/ui/data-table';
import CamelotWheel from '@/components/camelot/CamelotWheel';
import PlaylistGenerator from '@/components/playlist/PlaylistGenerator';
import { PageHeader } from '@/components/ui/page-header';
import { EmptyState } from '@/components/ui/empty-state';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Music, 
  Play, 
  Layers3, 
  Plus,
  Download,
  Edit,
  Trash2
} from 'lucide-react';

const Index = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [selectedAudioFile, setSelectedAudioFile] = useState<File | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Mock library data for the table
  const libraryTracks = [
    { 
      id: 1, 
      title: "Summer Vibes", 
      artist: "DJ Alex", 
      bpm: 126, 
      key: "8A", 
      energy: 7.2, 
      genre: "House", 
      duration: "4:32",
      camelot: "8A",
      confidence: 0.95
    },
    { 
      id: 2, 
      title: "Night Drive", 
      artist: "Urban Beats", 
      bpm: 132, 
      key: "5B", 
      energy: 8.1, 
      genre: "Techno", 
      duration: "5:18",
      camelot: "5B",
      confidence: 0.89
    },
    { 
      id: 3, 
      title: "Ocean Dreams", 
      artist: "Deep House Co", 
      bpm: 120, 
      key: "3A", 
      energy: 6.5, 
      genre: "Deep House", 
      duration: "6:24",
      camelot: "3A",
      confidence: 0.92
    },
    { 
      id: 4, 
      title: "Electric Soul", 
      artist: "Synth Masters", 
      bpm: 128, 
      key: "11B", 
      energy: 7.8, 
      genre: "Electronic", 
      duration: "4:45",
      camelot: "11B",
      confidence: 0.87
    }
  ];

  const libraryColumns = [
    {
      key: 'title' as keyof typeof libraryTracks[0],
      title: 'Track',
      render: (value: any, row: any) => (
        <div>
          <div className="font-medium text-foreground">{row.title}</div>
          <div className="text-sm text-muted-foreground">{row.artist}</div>
        </div>
      )
    },
    {
      key: 'bpm' as keyof typeof libraryTracks[0],
      title: 'BPM',
      sortable: true,
      render: (value: number) => (
        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
          {value}
        </Badge>
      )
    },
    {
      key: 'camelot' as keyof typeof libraryTracks[0],
      title: 'Key',
      render: (value: string) => (
        <Badge variant="outline" className="bg-camelot-major/10 text-camelot-major border-camelot-major/20">
          {value}
        </Badge>
      )
    },
    {
      key: 'energy' as keyof typeof libraryTracks[0],
      title: 'Energy',
      sortable: true,
      render: (value: number) => (
        <div className="flex items-center gap-2">
          <div className="w-12 bg-muted rounded-full h-2">
            <div 
              className="bg-energy-mid h-2 rounded-full" 
              style={{ width: `${(value / 10) * 100}%` }}
            />
          </div>
          <span className="text-sm text-energy-mid">{value}</span>
        </div>
      )
    },
    {
      key: 'genre' as keyof typeof libraryTracks[0],
      title: 'Genre',
      render: (value: string) => (
        <Badge variant="secondary">{value}</Badge>
      )
    },
    {
      key: 'duration' as keyof typeof libraryTracks[0],
      title: 'Duration'
    }
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <div className="space-y-8">
            <PageHeader 
              title="Dashboard"
              description="Overview of your DJ library and recent activity"
            />
            <ModernDashboardStats />
          </div>
        );
        
      case 'analyzer':
        return (
          <div className="space-y-8">
            <PageHeader 
              title="Track Analyzer"
              description="Upload and analyze your music tracks for BPM, key, and energy"
              actions={
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Batch Analyze
                </Button>
              }
            />
            
            <div className="grid gap-6 lg:grid-cols-2">
              <ModernFileUpload 
                onFilesAdded={(files) => setSelectedAudioFile(files[0])}
              />
              
              <WaveformCard 
                title={selectedAudioFile?.name || "No Track Loaded"}
                artist="Unknown Artist"
                bpm={128}
                key="8A"
                energy={7.5}
                duration={240}
                currentTime={60}
                isPlaying={isPlaying}
                volume={80}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onSeek={(time) => console.log('Seek to:', time)}
                onVolumeChange={(vol) => console.log('Volume:', vol)}
                cues={[
                  { type: 'intro', time: 16 },
                  { type: 'breakdown', time: 64 },
                  { type: 'drop', time: 96 },
                  { type: 'outro', time: 208 }
                ]}
              />
            </div>
            
            <div className="grid gap-6 lg:grid-cols-2">
              <CamelotWheel 
                currentKey="8A"
                compatibleKeys={['8B', '7A', '9A']}
                onKeySelect={(key) => console.log('Key selected:', key)}
              />
              
              <div className="space-y-4">
                <h3 className="text-heading-3 text-foreground">Analysis Results</h3>
                <div className="grid gap-4">
                  <div className="p-4 rounded-xl bg-surface border border-border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Confidence</span>
                      <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
                        95%
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-xl font-bold text-primary">128</div>
                        <div className="text-xs text-muted-foreground">BPM</div>
                      </div>
                      <div>
                        <div className="text-xl font-bold text-camelot-major">8A</div>
                        <div className="text-xs text-muted-foreground">Key</div>
                      </div>
                      <div>
                        <div className="text-xl font-bold text-energy-mid">7.5</div>
                        <div className="text-xs text-muted-foreground">Energy</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'library':
        return (
          <div className="space-y-8">
            <PageHeader 
              title="Music Library"
              description="Your analyzed tracks with advanced filtering and search"
              actions={
                <div className="flex gap-2">
                  <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                  <Button onClick={() => setActiveSection('analyzer')}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Tracks
                  </Button>
                </div>
              }
            />
            
            <DataTable
              data={libraryTracks}
              columns={libraryColumns}
              searchable
              searchPlaceholder="Search tracks, artists, keys..."
              filterable
              exportable
              emptyState={{
                icon: Music,
                title: "No tracks in library",
                description: "Start by analyzing some tracks to build your music library",
                action: {
                  label: "Go to Analyzer",
                  onClick: () => setActiveSection('analyzer')
                }
              }}
            />
          </div>
        );
        
      case 'playlists':
        return (
          <div className="space-y-8">
            <PageHeader 
              title="Playlist Generator"
              description="Create intelligent playlists based on harmonic mixing"
            />
            <PlaylistGenerator />
          </div>
        );
        
      case 'set-builder':
        return (
          <div className="space-y-8">
            <PageHeader 
              title="DJ Set Builder"
              description="Build perfect DJ sets with harmonic mixing suggestions"
              actions={
                <Button>
                  <Layers3 className="w-4 h-4 mr-2" />
                  New Set
                </Button>
              }
            />
            <CamelotWheel />
          </div>
        );
        
      case 'settings':
        return (
          <div className="space-y-8">
            <PageHeader
              title="Settings"
              description="Configure your DJ Suite preferences and integrations"
            />
            <EmptyState 
              title="Settings Coming Soon"
              description="Advanced configuration options will be available here"
            />
          </div>
        );
        
      default:
        return (
          <div className="space-y-8">
            <PageHeader 
              title="Welcome to DJ Suite v2"
              description="Professional harmonic mixing tools for modern DJs"
            />
            <ModernDashboardStats />
          </div>
        );
    }
  };

  return (
    <DJLayout 
      activeSection={activeSection} 
      onSectionChange={setActiveSection}
    >
      {renderContent()}
    </DJLayout>
  );
};

export default Index;
