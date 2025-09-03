import React, { useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';

interface WaveformDisplayProps {
  audioFile?: File;
  isPlaying?: boolean;
  onPlayPause?: () => void;
  onSeek?: (position: number) => void;
  bpm?: number;
  key?: string;
  energy?: number;
}

const WaveformDisplay: React.FC<WaveformDisplayProps> = ({
  audioFile,
  isPlaying = false,
  onPlayPause,
  onSeek,
  bpm = 128,
  key = "8A",
  energy = 7.5
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Mock waveform data
    const width = canvas.width;
    const height = canvas.height;
    const centerY = height / 2;

    ctx.clearRect(0, 0, width, height);

    // Draw background grid
    ctx.strokeStyle = 'hsl(var(--border))';
    ctx.lineWidth = 1;
    for (let i = 0; i < width; i += 50) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, height);
      ctx.stroke();
    }

    // Generate mock waveform
    const gradient = ctx.createLinearGradient(0, 0, width, 0);
    gradient.addColorStop(0, 'hsl(var(--waveform))');
    gradient.addColorStop(1, 'hsl(var(--accent))');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    
    for (let x = 0; x < width; x += 2) {
      const amplitude = Math.random() * 0.8 + 0.1;
      const waveHeight = amplitude * centerY * 0.8;
      
      ctx.rect(x, centerY - waveHeight/2, 1, waveHeight);
    }
    
    ctx.fill();

    // Draw beat grid
    ctx.strokeStyle = 'hsl(var(--beatgrid))';
    ctx.lineWidth = 2;
    for (let i = 0; i < width; i += 80) {
      ctx.beginPath();
      ctx.moveTo(i, centerY - 20);
      ctx.lineTo(i, centerY + 20);
      ctx.stroke();
    }

    // Draw playhead
    const playheadX = width * 0.3; // Mock position
    ctx.strokeStyle = 'hsl(var(--cue))';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(playheadX, 0);
    ctx.lineTo(playheadX, height);
    ctx.stroke();

  }, [audioFile]);

  return (
    <Card className="p-6 bg-surface border-border">
      <div className="space-y-4">
        {/* Track Info */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              {audioFile?.name || "No Track Loaded"}
            </h3>
            <p className="text-sm text-muted-foreground">
              Ready for analysis
            </p>
          </div>
          
          {/* Analysis Results */}
          <div className="flex gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{bpm}</div>
              <div className="text-xs text-muted-foreground">BPM</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-camelot-major">{key}</div>
              <div className="text-xs text-muted-foreground">Key</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-energy-mid">{energy}</div>
              <div className="text-xs text-muted-foreground">Energy</div>
            </div>
          </div>
        </div>

        {/* Waveform Canvas */}
        <div className="relative bg-background/50 rounded-lg border border-border overflow-hidden">
          <canvas
            ref={canvasRef}
            width={800}
            height={200}
            className="w-full h-48 cursor-pointer"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const position = x / rect.width;
              onSeek?.(position);
            }}
          />
        </div>

        {/* Transport Controls */}
        <div className="flex items-center justify-center gap-2">
          <Button variant="outline" size="sm">
            <SkipBack className="w-4 h-4" />
          </Button>
          <Button 
            variant={isPlaying ? "secondary" : "default"}
            size="sm"
            onClick={onPlayPause}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>
          <Button variant="outline" size="sm">
            <SkipForward className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default WaveformDisplay;