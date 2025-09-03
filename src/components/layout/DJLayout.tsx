import React from 'react';
import { AppSidebar } from './AppSidebar';
import { Topbar } from './Topbar';
import { ThemeProvider } from '@/components/theme/ThemeProvider';
import { motion, AnimatePresence } from 'framer-motion';

interface DJLayoutProps {
  children: React.ReactNode;
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const DJLayout: React.FC<DJLayoutProps> = ({ 
  children, 
  activeSection, 
  onSectionChange 
}) => {
  return (
    <ThemeProvider defaultTheme="dark">
      <div className="min-h-screen bg-background text-foreground flex">
        <AppSidebar 
          activeSection={activeSection}
          onSectionChange={onSectionChange}
        />
        
        <div className="flex-1 flex flex-col min-w-0">
          <Topbar activeSection={activeSection} />
          
          <main className="flex-1 overflow-auto">
            <div className="container mx-auto px-6 py-8 max-w-7xl">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSection}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="h-full"
                >
                  {children}
                </motion.div>
              </AnimatePresence>
            </div>
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default DJLayout;