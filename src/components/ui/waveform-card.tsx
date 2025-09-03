import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CueBadge, CueType } from "./cue-badge"
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2,
  Maximize2,
  Settings
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { Slider } from "./slider"

interface Cue {
  type: CueType
  time: number
  label?: string
  bar?: number
}

interface WaveformCardProps {
  className?: string
  title?: string
  artist?: string
  bpm?: number
  key?: string
  energy?: number
  duration?: number
  currentTime?: number
  isPlaying?: boolean
  volume?: number
  cues?: Cue[]
  waveformData?: number[]
  onPlay?: () => void
  onPause?: () => void
  onSeek?: (time: number) => void
  onVolumeChange?: (volume: number) => void
  onCueClick?: (cue: Cue) => void
  loading?: boolean
}

const WaveformCard: React.FC<WaveformCardProps> = ({ 
    className,
    title = "No Track Loaded",
    artist,
    bpm = 128,
    key = "8A", 
    energy = 7.5,
    duration = 0,
    currentTime = 0,
    isPlaying = false,
    volume = 80,
    cues = [],
    waveformData = [],
    onPlay,
    onPause,
    onSeek,
    onVolumeChange,
    onCueClick,
    loading = false
  }) => {
    const canvasRef = React.useRef<HTMLCanvasElement>(null)
    const progress = duration > 0 ? (currentTime / duration) * 100 : 0

    // Draw waveform
    React.useEffect(() => {
      const canvas = canvasRef.current
      if (!canvas) return

      const ctx = canvas.getContext('2d')
      if (!ctx) return

      const { width, height } = canvas
      const centerY = height / 2

      // Clear canvas
      ctx.clearRect(0, 0, width, height)

      // Get CSS colors
      const getColor = (property: string) => {
        const root = document.documentElement
        return `hsl(${getComputedStyle(root).getPropertyValue(property).trim()})`
      }

      const borderColor = getColor('--border')
      const waveformColor = getColor('--waveform')
      const accentColor = getColor('--accent')
      const progressColor = getColor('--primary')

      // Draw background grid
      ctx.strokeStyle = borderColor
      ctx.lineWidth = 1
      ctx.globalAlpha = 0.3
      for (let i = 0; i < width; i += 40) {
        ctx.beginPath()
        ctx.moveTo(i, 0)
        ctx.lineTo(i, height)
        ctx.stroke()
      }
      ctx.globalAlpha = 1

      // Generate or use provided waveform data
      const data = waveformData.length > 0 ? waveformData : Array.from({ length: width / 2 }, () => Math.random())
      
      // Draw waveform
      const gradient = ctx.createLinearGradient(0, 0, width, 0)
      gradient.addColorStop(0, waveformColor)
      gradient.addColorStop(1, accentColor)
      
      ctx.fillStyle = gradient
      
      for (let i = 0; i < data.length; i++) {
        const x = (i / data.length) * width
        const amplitude = data[i]
        const barHeight = amplitude * centerY * 0.8
        
        ctx.fillRect(x, centerY - barHeight / 2, 2, barHeight)
      }

      // Draw progress overlay
      const progressX = (progress / 100) * width
      ctx.fillStyle = progressColor
      ctx.globalAlpha = 0.3
      ctx.fillRect(0, 0, progressX, height)
      ctx.globalAlpha = 1

      // Draw progress line
      ctx.strokeStyle = progressColor
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(progressX, 0)
      ctx.lineTo(progressX, height)
      ctx.stroke()

      // Draw cue points
      cues.forEach((cue) => {
        const cueX = (cue.time / duration) * width
        ctx.strokeStyle = getColor('--cue')
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(cueX, centerY - 15)
        ctx.lineTo(cueX, centerY + 15)
        ctx.stroke()
      })

    }, [waveformData, progress, cues, duration])

    const formatTime = (seconds: number) => {
      const mins = Math.floor(seconds / 60)
      const secs = Math.floor(seconds % 60)
      return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    return (
      <Card className={cn("bg-surface border-border", className)}>
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="space-y-1 min-w-0 flex-1">
              <CardTitle className="text-lg truncate text-foreground">
                {title}
              </CardTitle>
              {artist && (
                <p className="text-sm text-muted-foreground truncate">
                  {artist}
                </p>
              )}
            </div>
            
            <div className="flex items-center gap-2 shrink-0">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Settings className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Maximize2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Track Info */}
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
              {bpm} BPM
            </Badge>
            <Badge variant="secondary" className="bg-camelot-major/10 text-camelot-major border-camelot-major/20">
              {key}
            </Badge>
            <Badge variant="secondary" className="bg-energy-mid/10 text-energy-mid border-energy-mid/20">
              {energy}/10 Energy
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Waveform Display */}
          <div className="relative bg-surface-elevated rounded-lg border border-border overflow-hidden">
            <canvas
              ref={canvasRef}
              width={800}
              height={120}
              className="w-full h-32 cursor-pointer"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect()
                const x = e.clientX - rect.left
                const clickProgress = (x / rect.width) * 100
                const newTime = (clickProgress / 100) * duration
                onSeek?.(newTime)
              }}
            />
            
            {/* Cue Points Overlay */}
            <div className="absolute top-2 left-2 right-2">
              <div className="flex gap-1 flex-wrap">
                {cues.slice(0, 4).map((cue, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <CueBadge
                      type={cue.type}
                      time={formatTime(cue.time)}
                      bar={cue.bar}
                      onClick={() => onCueClick?.(cue)}
                      active={currentTime >= cue.time - 2 && currentTime <= cue.time + 2}
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Transport Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" className="h-9 w-9">
                <SkipBack className="h-4 w-4" />
              </Button>
              <Button
                variant={isPlaying ? "secondary" : "default"}
                size="icon"
                className="h-10 w-10"
                onClick={isPlaying ? onPause : onPlay}
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              <Button variant="outline" size="icon" className="h-9 w-9">
                <SkipForward className="h-4 w-4" />
              </Button>
            </div>

            {/* Time Display */}
            <div className="text-sm text-muted-foreground font-mono">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>

            {/* Volume Control */}
            <div className="flex items-center gap-2">
              <Volume2 className="h-4 w-4 text-muted-foreground" />
              <Slider
                value={[volume]}
                onValueChange={([value]) => onVolumeChange?.(value)}
                max={100}
                step={1}
                className="w-20"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

export { WaveformCard, type Cue }