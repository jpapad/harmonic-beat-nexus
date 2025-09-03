import React, { useCallback, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Upload, 
  FileAudio, 
  X, 
  CheckCircle, 
  AlertCircle,
  Loader2 
} from 'lucide-react';

interface FileUploadProps {
  onFileSelect?: (file: File) => void;
  onAnalysisComplete?: (results: any) => void;
  maxSize?: number; // MB
  acceptedFormats?: string[];
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  onAnalysisComplete,
  maxSize = 50,
  acceptedFormats = ['.mp3', '.wav', '.aiff', '.flac']
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState<Array<{
    file: File;
    status: 'pending' | 'analyzing' | 'completed' | 'error';
    progress: number;
    results?: any;
    error?: string;
  }>>([]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    handleFiles(selectedFiles);
    e.target.value = ''; // Reset input
  }, []);

  const handleFiles = useCallback((newFiles: File[]) => {
    const validFiles = newFiles.filter(file => {
      const extension = '.' + file.name.split('.').pop()?.toLowerCase();
      const isValidFormat = acceptedFormats.includes(extension);
      const isValidSize = file.size <= maxSize * 1024 * 1024;
      
      return isValidFormat && isValidSize;
    });

    const fileEntries = validFiles.map(file => ({
      file,
      status: 'pending' as const,
      progress: 0
    }));

    setFiles(prev => [...prev, ...fileEntries]);
    
    // Start analysis for each file
    fileEntries.forEach((entry, index) => {
      simulateAnalysis(files.length + index);
      onFileSelect?.(entry.file);
    });
  }, [files.length, acceptedFormats, maxSize, onFileSelect]);

  const simulateAnalysis = useCallback((fileIndex: number) => {
    // Update status to analyzing
    setFiles(prev => prev.map((file, idx) => 
      idx === fileIndex 
        ? { ...file, status: 'analyzing' as const }
        : file
    ));

    // Simulate progress
    let progress = 0;
    const progressInterval = setInterval(() => {
      progress += Math.random() * 30;
      
      setFiles(prev => prev.map((file, idx) => 
        idx === fileIndex 
          ? { ...file, progress: Math.min(progress, 100) }
          : file
      ));

      if (progress >= 100) {
        clearInterval(progressInterval);
        
        // Simulate completion with mock results
        setTimeout(() => {
          const mockResults = {
            id: `track_${Date.now()}`,
            duration_ms: 180000 + Math.random() * 120000,
            bpm: Math.floor(120 + Math.random() * 40),
            bpm_confidence: 0.8 + Math.random() * 0.2,
            key: {
              note: ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'][Math.floor(Math.random() * 12)],
              mode: Math.random() > 0.5 ? 'major' : 'minor',
              camelot: Math.floor(1 + Math.random() * 12) + (Math.random() > 0.5 ? 'A' : 'B'),
              confidence: 0.7 + Math.random() * 0.3
            },
            energy: {
              lufs: -12 - Math.random() * 10,
              rms: 0.3 + Math.random() * 0.4,
              score: 1 + Math.random() * 9
            }
          };

          setFiles(prev => prev.map((file, idx) => 
            idx === fileIndex 
              ? { 
                  ...file, 
                  status: 'completed' as const, 
                  progress: 100,
                  results: mockResults
                }
              : file
          ));

          onAnalysisComplete?.(mockResults);
        }, 500);
      }
    }, 300);
  }, [onAnalysisComplete]);

  const removeFile = useCallback((index: number) => {
    setFiles(prev => prev.filter((_, idx) => idx !== index));
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'analyzing':
        return <Loader2 className="w-4 h-4 animate-spin text-primary" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-energy-low" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-destructive" />;
      default:
        return <FileAudio className="w-4 h-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <Card 
        className={`border-2 border-dashed transition-colors ${
          dragActive 
            ? 'border-primary bg-primary/5' 
            : 'border-border bg-surface/50'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="p-8 text-center">
          <Upload className={`w-12 h-12 mx-auto mb-4 ${
            dragActive ? 'text-primary' : 'text-muted-foreground'
          }`} />
          
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Drop audio files here or click to browse
          </h3>
          
          <p className="text-sm text-muted-foreground mb-4">
            Supports {acceptedFormats.join(', ')} files up to {maxSize}MB
          </p>
          
          <Button variant="outline" asChild>
            <label className="cursor-pointer">
              <input
                type="file"
                multiple
                accept={acceptedFormats.join(',')}
                onChange={handleFileInput}
                className="hidden"
              />
              Select Files
            </label>
          </Button>
        </div>
      </Card>

      {/* File List */}
      {files.length > 0 && (
        <Card className="p-4 bg-surface border-border">
          <div className="space-y-3">
            <h4 className="font-medium text-foreground">Processing Queue</h4>
            
            {files.map((fileEntry, index) => (
              <div key={index} className="flex items-center gap-4 p-3 rounded-lg bg-background/50 border border-border">
                <div className="flex-shrink-0">
                  {getStatusIcon(fileEntry.status)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">
                    {fileEntry.file.name}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>{(fileEntry.file.size / 1024 / 1024).toFixed(1)} MB</span>
                    {fileEntry.results && (
                      <>
                        <span>BPM: {fileEntry.results.bpm}</span>
                        <span>Key: {fileEntry.results.key.camelot}</span>
                        <span>Energy: {fileEntry.results.energy.score.toFixed(1)}</span>
                      </>
                    )}
                  </div>
                  
                  {fileEntry.status === 'analyzing' && (
                    <div className="mt-2">
                      <Progress value={fileEntry.progress} className="h-2" />
                    </div>
                  )}
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(index)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default FileUpload;