import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, X, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface UploadFile extends File {
  id: string;
  progress?: number;
  status?: 'uploading' | 'completed' | 'error';
  error?: string;
}

interface ModernFileUploadProps {
  onFilesAdded?: (files: File[]) => void;
  maxFiles?: number;
  accept?: Record<string, string[]>;
  className?: string;
}

const ModernFileUpload: React.FC<ModernFileUploadProps> = ({
  onFilesAdded,
  maxFiles = 10,
  accept = {
    'audio/*': ['.mp3', '.wav', '.aiff', '.flac', '.m4a']
  },
  className
}) => {
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles: UploadFile[] = acceptedFiles.map(file => ({
      ...file,
      id: Math.random().toString(36).substr(2, 9),
      progress: 0,
      status: 'uploading'
    }));

    setUploadFiles(prev => [...prev, ...newFiles]);
    
    // Simulate upload progress
    newFiles.forEach((file, index) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 20;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          setUploadFiles(prev => prev.map(f => 
            f.id === file.id 
              ? { ...f, progress: 100, status: 'completed' }
              : f
          ));
        } else {
          setUploadFiles(prev => prev.map(f => 
            f.id === file.id 
              ? { ...f, progress }
              : f
          ));
        }
      }, 200 + index * 100);
    });

    onFilesAdded?.(acceptedFiles);
  }, [onFilesAdded]);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragReject
  } = useDropzone({
    onDrop,
    accept,
    maxFiles,
    multiple: true
  });

  const removeFile = (fileId: string) => {
    setUploadFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Drop Zone */}
      <motion.div
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <Card 
          {...getRootProps()}
          className={cn(
            "relative border-2 border-dashed transition-all duration-200 cursor-pointer",
            "hover:border-primary/50 hover:bg-surface/50",
            isDragActive && !isDragReject && "border-primary bg-primary/5",
            isDragReject && "border-destructive bg-destructive/5",
            "bg-surface/20"
          )}
        >
          <input {...getInputProps()} />
          <CardContent className="flex flex-col items-center justify-center py-12 px-6 text-center">
            <motion.div
              animate={{ 
                scale: isDragActive ? 1.1 : 1,
                rotate: isDragActive ? 5 : 0
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className={cn(
                "mb-4 rounded-full p-4",
                isDragActive 
                  ? "bg-primary/10 text-primary" 
                  : "bg-muted text-muted-foreground"
              )}
            >
              <Upload className="h-8 w-8" />
            </motion.div>
            
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {isDragActive ? "Drop your tracks here" : "Upload Audio Files"}
            </h3>
            
            <p className="text-sm text-muted-foreground mb-4 max-w-sm">
              {isDragReject 
                ? "Some files are not supported" 
                : `Drag & drop your music files here, or click to browse. Supports MP3, WAV, AIFF, FLAC.`
              }
            </p>
            
            <div className="text-xs text-muted-foreground">
              Maximum {maxFiles} files • Up to 100MB each
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* File List */}
      <AnimatePresence>
        {uploadFiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3"
          >
            {uploadFiles.map((file) => (
              <motion.div
                key={file.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                layout
              >
                <Card className="bg-surface border-border">
                  <CardContent className="flex items-center gap-4 p-4">
                    <div className="flex-shrink-0">
                      <div className="p-2 rounded-lg bg-muted">
                        <File className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium text-foreground truncate">
                          {file.name}
                        </p>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 shrink-0"
                          onClick={() => removeFile(file.id)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                      
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{formatFileSize(file.size)}</span>
                        {file.status && (
                          <>
                            <span>•</span>
                            <div className="flex items-center gap-1">
                              {file.status === 'uploading' && (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              )}
                              {file.status === 'completed' && (
                                <CheckCircle className="h-3 w-3 text-success" />
                              )}
                              {file.status === 'error' && (
                                <AlertCircle className="h-3 w-3 text-destructive" />
                              )}
                              <span className="capitalize">{file.status}</span>
                            </div>
                          </>
                        )}
                      </div>
                      
                      {file.progress !== undefined && file.status === 'uploading' && (
                        <Progress 
                          value={file.progress} 
                          className="mt-2 h-1"
                        />
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ModernFileUpload;