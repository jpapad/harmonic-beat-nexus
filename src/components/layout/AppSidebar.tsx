import { 
  Home, 
  Waves, 
  ListMusic, 
  Layers3, 
  Library,
  Settings,
  Disc3,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"

interface AppSidebarProps {
  activeSection: string
  onSectionChange: (section: string) => void
}

const sidebarItems = [
  { 
    id: 'dashboard', 
    label: 'Dashboard', 
    icon: Home,
    description: 'Overview & Stats'
  },
  { 
    id: 'analyzer', 
    label: 'Analyzer', 
    icon: Waves,
    description: 'Track Analysis'
  },
  { 
    id: 'library', 
    label: 'Library', 
    icon: Library,
    description: 'Music Library'
  },
  { 
    id: 'playlists', 
    label: 'Playlists', 
    icon: ListMusic,
    description: 'Playlist Generator'
  },
  { 
    id: 'set-builder', 
    label: 'Set Builder', 
    icon: Layers3,
    description: 'DJ Set Builder'
  },
  { 
    id: 'settings', 
    label: 'Settings', 
    icon: Settings,
    description: 'App Settings'
  }
]

export function AppSidebar({ activeSection, onSectionChange }: AppSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <motion.aside 
      className={cn(
        "flex h-screen flex-col border-r border-border bg-surface-elevated",
        "transition-all duration-300 ease-in-out",
        isCollapsed ? "w-16" : "w-64"
      )}
      initial={false}
      animate={{ width: isCollapsed ? 64 : 256 }}
    >
      {/* Header */}
      <div className="flex h-16 items-center justify-between border-b border-border px-4">
        <AnimatePresence mode="wait">
          {!isCollapsed && (
            <motion.div
              key="expanded-header"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-3"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Disc3 className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold tracking-tight text-foreground">DJ Suite</h2>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-3">
        {sidebarItems.map((item) => {
          const isActive = activeSection === item.id
          return (
            <motion.div
              key={item.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-3 h-12",
                  "transition-all duration-200",
                  isActive 
                    ? "bg-primary/10 text-primary border-l-2 border-primary" 
                    : "hover:bg-surface-hover text-muted-foreground hover:text-foreground",
                  isCollapsed && "px-3"
                )}
                onClick={() => onSectionChange(item.id)}
              >
                <item.icon className={cn("h-5 w-5 shrink-0", isActive && "text-primary")} />
                <AnimatePresence mode="wait">
                  {!isCollapsed && (
                    <motion.div
                      key="nav-label"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.15 }}
                      className="flex flex-col items-start"
                    >
                      <span className="text-sm font-medium">{item.label}</span>
                      <span className="text-xs text-muted-foreground">{item.description}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>
            </motion.div>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-border p-3">
        <AnimatePresence mode="wait">
          {!isCollapsed && (
            <motion.div
              key="footer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-xs text-muted-foreground text-center"
            >
              <p>DJ Suite v2.0</p>
              <p>Professional Edition</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.aside>
  )
}