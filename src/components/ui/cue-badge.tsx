import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

type CueType = "intro" | "breakdown" | "drop" | "outro" | "verse" | "chorus" | "bridge"

interface CueBadgeProps {
  type: CueType
  time?: string
  bar?: number
  className?: string
  onClick?: () => void
  active?: boolean
}

const cueConfig: Record<CueType, {
  label: string
  color: string
  bgColor: string
}> = {
  intro: {
    label: "Intro",
    color: "text-energy-low",
    bgColor: "bg-energy-low/10 border-energy-low/20"
  },
  breakdown: {
    label: "Breakdown", 
    color: "text-accent",
    bgColor: "bg-accent/10 border-accent/20"
  },
  drop: {
    label: "Drop",
    color: "text-energy-high",
    bgColor: "bg-energy-high/10 border-energy-high/20"
  },
  outro: {
    label: "Outro",
    color: "text-muted-foreground",
    bgColor: "bg-muted/10 border-muted/20"
  },
  verse: {
    label: "Verse",
    color: "text-primary",
    bgColor: "bg-primary/10 border-primary/20"
  },
  chorus: {
    label: "Chorus", 
    color: "text-energy-mid",
    bgColor: "bg-energy-mid/10 border-energy-mid/20"
  },
  bridge: {
    label: "Bridge",
    color: "text-beatgrid",
    bgColor: "bg-beatgrid/10 border-beatgrid/20"
  }
}

const CueBadge = React.forwardRef<HTMLDivElement, CueBadgeProps>(
  ({ type, time, bar, className, onClick, active, ...props }, ref) => {
    const config = cueConfig[type]

    return (
      <motion.div
        ref={ref}
        whileHover={{ scale: onClick ? 1.05 : 1 }}
        whileTap={{ scale: onClick ? 0.95 : 1 }}
        {...props}
      >
        <Badge
          variant="outline"
          className={cn(
            "relative cursor-pointer transition-all duration-200",
            config.bgColor,
            config.color,
            "hover:shadow-sm",
            active && "ring-2 ring-primary/50",
            onClick && "hover:scale-105",
            className
          )}
          onClick={onClick}
        >
          <div className="flex items-center gap-2">
            <div className="flex flex-col items-start">
              <span className="text-xs font-medium leading-none">
                {config.label}
              </span>
              {(time || bar) && (
                <span className="text-xs opacity-70 leading-none mt-0.5">
                  {time || (bar && `Bar ${bar}`)}
                </span>
              )}
            </div>
            {active && (
              <motion.div
                className="w-2 h-2 rounded-full bg-current"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
          </div>
        </Badge>
      </motion.div>
    )
  }
)
CueBadge.displayName = "CueBadge"

export { CueBadge, type CueType }