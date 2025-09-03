import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Music, 
  Shuffle, 
  Play, 
  Clock, 
  TrendingUp,
  Zap,
  Volume2
} from 'lucide-react';

const PlaylistGenerator: React.FC = () => {
  const [filters, setFilters] = useState({
    duration: [60], // minutes
    bpmRange: [120, 140],
    energyRange: [5, 8],
    keyCompatibility: true,
    genre: [],
    mood: 'energetic'
  });

  const [generatedTracks] = useState([
    {
      id: 1,
      title: "Summer Nights",
      artist: "Deep House Collective",
      bpm: 126,
      key: "8A",
      energy: 7.2,
      duration: "4:32",
      genre: "Deep House",
      compatible: true
    },
    {
      id: 2,
      title: "Electric Dreams",
      artist: "Synth Masters",
      bpm: 128,
      key: "8B",
      energy: 8.1,
      duration: "3:45",
      genre: "Electronic",
      compatible: true
    },
    {
      id: 3,
      title: "Midnight Drive",
      artist: "Urban Beats",
      bpm: 124,
      key: "7A",
      energy: 6.8,
      duration: "5:12",
      genre: "Techno",
      compatible: true
    }
  ]);

  const genres = ['House', 'Techno', 'Deep House', 'Progressive', 'Trance', 'Electronic'];
  const moods = ['Chill', 'Energetic', 'Dark', 'Uplifting', 'Atmospheric'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Filters Panel */}
      <div className="lg:col-span-1">
        <Card className="bg-surface border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Playlist Filters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Duration */}
            <div className="space-y-2">
              <Label className="text-foreground flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Target Duration: {filters.duration[0]} minutes
              </Label>
              <Slider
                value={filters.duration}
                onValueChange={(value) => setFilters(prev => ({ ...prev, duration: value }))}
                max={180}
                min={30}
                step={15}
                className="py-4"
              />
            </div>

            {/* BPM Range */}
            <div className="space-y-2">
              <Label className="text-foreground flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                BPM Range: {filters.bpmRange[0]} - {filters.bpmRange[1]}
              </Label>
              <Slider
                value={filters.bpmRange}
                onValueChange={(value) => setFilters(prev => ({ ...prev, bpmRange: value }))}
                max={180}
                min={80}
                step={5}
                className="py-4 range-slider"
              />
            </div>

            {/* Energy Range */}
            <div className="space-y-2">
              <Label className="text-foreground flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Energy Level: {filters.energyRange[0]} - {filters.energyRange[1]}
              </Label>
              <Slider
                value={filters.energyRange}
                onValueChange={(value) => setFilters(prev => ({ ...prev, energyRange: value }))}
                max={10}
                min={1}
                step={0.5}
                className="py-4"
              />
            </div>

            {/* Key Compatibility */}
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="keyCompatibility"
                checked={filters.keyCompatibility}
                onCheckedChange={(checked) => 
                  setFilters(prev => ({ ...prev, keyCompatibility: !!checked }))
                }
              />
              <Label htmlFor="keyCompatibility" className="text-foreground">
                Harmonic Mixing (Key Compatible)
              </Label>
            </div>

            {/* Genre Selection */}
            <div className="space-y-2">
              <Label className="text-foreground">Genres</Label>
              <div className="flex flex-wrap gap-2">
                {genres.map(genre => (
                  <Badge
                    key={genre}
                    variant={filters.genre.includes(genre) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => {
                      setFilters(prev => ({
                        ...prev,
                        genre: prev.genre.includes(genre)
                          ? prev.genre.filter(g => g !== genre)
                          : [...prev.genre, genre]
                      }));
                    }}
                  >
                    {genre}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Generate Button */}
            <Button className="w-full bg-primary hover:bg-primary/90" size="lg">
              <Shuffle className="w-4 h-4 mr-2" />
              Generate Playlist
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Generated Playlist */}
      <div className="lg:col-span-2">
        <Card className="bg-surface border-border">
          <CardHeader className="flex-row items-center justify-between">
            <div>
              <CardTitle className="text-foreground">Generated Playlist</CardTitle>
              <p className="text-sm text-muted-foreground">
                {generatedTracks.length} tracks • Est. {Math.floor(generatedTracks.length * 4.2)} minutes
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Volume2 className="w-4 h-4 mr-2" />
                Preview
              </Button>
              <Button variant="default" size="sm">
                Push to Spotify
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {generatedTracks.map((track, index) => (
                <div 
                  key={track.id}
                  className="flex items-center gap-4 p-4 rounded-lg bg-background/50 border border-border hover:bg-background/70 transition-colors"
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
                    {index + 1}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-foreground truncate">{track.title}</h4>
                    <p className="text-sm text-muted-foreground">{track.artist}</p>
                  </div>

                  <div className="flex items-center gap-4 text-sm">
                    <div className="text-center">
                      <div className="font-medium text-foreground">{track.bpm}</div>
                      <div className="text-xs text-muted-foreground">BPM</div>
                    </div>
                    
                    <Badge 
                      variant="outline" 
                      className="bg-camelot-major/10 text-camelot-major border-camelot-major/30"
                    >
                      {track.key}
                    </Badge>
                    
                    <div className="text-center">
                      <div className="font-medium text-energy-mid">{track.energy}</div>
                      <div className="text-xs text-muted-foreground">Energy</div>
                    </div>
                    
                    <div className="text-muted-foreground">{track.duration}</div>
                  </div>

                  <Button variant="ghost" size="sm">
                    <Play className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>

            {generatedTracks.length === 0 && (
              <div className="text-center py-12">
                <Music className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Set your filters and click "Generate Playlist" to get started
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PlaylistGenerator;