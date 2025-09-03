import React, { useState } from 'react';
import DJLayout from '@/components/layout/DJLayout';
import DashboardStats from '@/components/dashboard/DashboardStats';
import FileUpload from '@/components/analyzer/FileUpload';
import WaveformDisplay from '@/components/analyzer/WaveformDisplay';
import PlaylistGenerator from '@/components/playlist/PlaylistGenerator';
import CamelotWheel from '@/components/camelot/CamelotWheel';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Search,
  Filter,
  Disc3,
  Play,
  Music,
  Clock,
  TrendingUp,
  Layers3,
  Settings as SettingsIcon
} from 'lucide-react';

const Index = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentKey, setCurrentKey] = useState('8A');

  // Mock library data
  const libraryTracks = [
    { id: 1, title: "Summer Vibes", artist: "DJ Alex", bpm: 126, key: "8A", energy: 7.2, genre: "House", duration: "4:32" },
    { id: 2, title: "Night Drive", artist: "Urban Beats", bpm: 132, key: "5B", energy: 8.1, genre: "Techno", duration: "5:18" },
    { id: 3, title: "Ocean Dreams", artist: "Deep House Co", bpm: 120, key: "3A", energy: 6.5, genre: "Deep House", duration: "6:24" },
    { id: 4, title: "Electric Soul", artist: "Synth Masters", bpm: 128, key: "11B", energy: 7.8, genre: "Electronic", duration: "4:45" },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardStats />;
      
      case 'analyzer':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Audio Analyzer</h1>
                <p className="text-muted-foreground">Upload and analyze tracks for BPM, key, and harmonic content</p>
              </div>
            </div>
            
            <FileUpload 
              onFileSelect={setSelectedFile}
              onAnalysisComplete={(results) => console.log('Analysis:', results)}
            />
            
            <WaveformDisplay 
              audioFile={selectedFile || undefined }
              isPlaying={isPlaying}
              onPlayPause={() => setIsPlaying(!isPlaying)}
            />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CamelotWheel 
                currentKey={currentKey}
                compatibleKeys={['8B', '7A', '9A']}
                onKeySelect={setCurrentKey}
              />
              
              <Card className="bg-surface border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Analysis Results</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 rounded-lg bg-background/50">
                        <div className="text-2xl font-bold text-primary">128</div>
                        <div className="text-sm text-muted-foreground">BPM</div>
                      </div>
                      <div className="text-center p-4 rounded-lg bg-background/50">
                        <div className="text-2xl font-bold text-camelot-major">8A</div>
                        <div className="text-sm text-muted-foreground">Key</div>
                      </div>
                    </div>
                    <div className="p-4 rounded-lg bg-background/50">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-muted-foreground">Energy Level</span>
                        <span className="text-sm font-medium text-energy-mid">7.5/10</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-energy-mid h-2 rounded-full w-3/4"></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      
      case 'playlists':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Playlist Generator</h1>
                <p className="text-muted-foreground">Create harmonic playlists with AI-powered suggestions</p>
              </div>
            </div>
            <PlaylistGenerator />
          </div>
        );
      
      case 'set-builder':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Set Builder</h1>
                <p className="text-muted-foreground">Build perfect DJ sets with harmonic mixing suggestions</p>
              </div>
              <Button className="bg-primary hover:bg-primary/90">
                <Layers3 className="w-4 h-4 mr-2" />
                New Set
              </Button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2 bg-surface border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Set Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {libraryTracks.slice(0, 3).map((track, index) => (
                      <div key={track.id} className="flex items-center gap-4 p-4 rounded-lg bg-background/50 border border-border">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-foreground">{track.title}</h4>
                          <p className="text-sm text-muted-foreground">{track.artist}</p>
                        </div>
                        <Badge variant="outline" className="bg-camelot-major/10 text-camelot-major">
                          {track.key}
                        </Badge>
                        <span className="text-sm text-muted-foreground">{track.bpm} BPM</span>
                        <Button variant="ghost" size="sm">
                          <Play className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-surface border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Suggestions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 rounded-lg bg-accent/10 border border-accent/20">
                      <h5 className="font-medium text-foreground">Perfect Match</h5>
                      <p className="text-sm text-muted-foreground">Electric Soul (11B) - Same energy, compatible key</p>
                    </div>
                    <div className="p-3 rounded-lg bg-background/50 border border-border">
                      <h5 className="font-medium text-foreground">Good Match</h5>
                      <p className="text-sm text-muted-foreground">Ocean Dreams (3A) - Lower energy, breakdown</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      
      case 'library':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Track Library</h1>
                <p className="text-muted-foreground">Your analyzed tracks with filtering and search</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </Button>
                <Button>
                  <Music className="w-4 h-4 mr-2" />
                  Add Tracks
                </Button>
              </div>
            </div>
            
            <Card className="bg-surface border-border">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input 
                      placeholder="Search tracks, artists, or keys..." 
                      className="pl-10 bg-background/50"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {libraryTracks.map((track) => (
                    <div key={track.id} className="flex items-center gap-4 p-4 rounded-lg bg-background/50 border border-border hover:bg-background/70 transition-colors">
                      <Button variant="ghost" size="sm">
                        <Play className="w-4 h-4" />
                      </Button>
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-foreground">{track.title}</h4>
                        <p className="text-sm text-muted-foreground">{track.artist}</p>
                      </div>

                      <Badge variant="outline">{track.genre}</Badge>
                      
                      <div className="flex items-center gap-4 text-sm">
                        <div className="text-center">
                          <div className="font-medium text-foreground">{track.bpm}</div>
                          <div className="text-xs text-muted-foreground">BPM</div>
                        </div>
                        
                        <Badge className="bg-camelot-major/10 text-camelot-major border-camelot-major/30">
                          {track.key}
                        </Badge>
                        
                        <div className="text-center">
                          <div className="font-medium text-energy-mid">{track.energy}</div>
                          <div className="text-xs text-muted-foreground">Energy</div>
                        </div>
                        
                        <div className="text-muted-foreground">{track.duration}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );
      
      case 'settings':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Settings</h1>
              <p className="text-muted-foreground">Configure your DJ Suite preferences</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-surface border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Theme & Branding</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground">Organization Name</label>
                    <Input placeholder="DJ Suite Pro" className="mt-1" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">Primary Color</label>
                    <div className="flex gap-2 mt-2">
                      <div className="w-8 h-8 rounded bg-primary border-2 border-primary"></div>
                      <div className="w-8 h-8 rounded bg-accent border border-border"></div>
                      <div className="w-8 h-8 rounded bg-destructive border border-border"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-surface border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Integrations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-foreground">Spotify</h4>
                      <p className="text-sm text-muted-foreground">Connect to push playlists</p>
                    </div>
                    <Button variant="outline" size="sm">Connect</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-foreground">SoundCloud</h4>
                      <p className="text-sm text-muted-foreground">Import tracks for analysis</p>
                    </div>
                    <Button variant="outline" size="sm">Connect</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      
      default:
        return <DashboardStats />;
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
