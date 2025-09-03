import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "./button"
import { motion } from "framer-motion"

interface EmptyStateProps {
  className?: string
  icon?: React.ComponentType<{ className?: string }>
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
}

const EmptyState: React.FC<EmptyStateProps> = ({ 
  className, 
  icon: Icon, 
  title, 
  description, 
  action 
}) => {
    return (
      <motion.div
        className={cn(
          "flex min-h-[400px] flex-col items-center justify-center text-center p-8",
          className
        )}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        {Icon && (
          <motion.div
            className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-muted"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Icon className="h-10 w-10 text-muted-foreground" />
          </motion.div>
        )}
        <motion.h3
          className="text-heading-3 text-foreground mb-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          {title}
        </motion.h3>
        {description && (
          <motion.p
            className="text-body text-muted-foreground mb-6 max-w-sm"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            {description}
          </motion.p>
        )}
        {action && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <Button onClick={action.onClick} size="lg">
              {action.label}
            </Button>
          </motion.div>
        )}
      </motion.div>
    )
  }

export { EmptyState }