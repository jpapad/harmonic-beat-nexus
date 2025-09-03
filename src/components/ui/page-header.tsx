import * as React from "react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface PageHeaderProps {
  className?: string
  title: string
  description?: string
  actions?: React.ReactNode
}

const PageHeader: React.FC<PageHeaderProps> = ({ 
  className, 
  title, 
  description, 
  actions 
}) => {
    return (
      <motion.div
        className={cn("flex items-center justify-between", className)}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="space-y-1">
          <h1 className="text-heading-1 text-foreground">{title}</h1>
          {description && (
            <p className="text-body text-muted-foreground max-w-2xl">
              {description}
            </p>
          )}
        </div>
        {actions && (
          <motion.div 
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            {actions}
          </motion.div>
        )}
      </motion.div>
    )
  }

export { PageHeader }