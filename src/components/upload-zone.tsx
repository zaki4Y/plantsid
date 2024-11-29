import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Loader2, Camera } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { identifyPlant, type PlantIdentification } from '@/lib/plant-service';
import { IdentificationResult } from './identification-result';
import { CameraCapture } from './camera-capture';
import { useTranslation } from 'react-i18next';

interface UploadZoneProps {
  onImageSelect?: (base64: string) => void;
}

export function UploadZone({ onImageSelect }: UploadZoneProps) {
  const { t } = useTranslation();
  const [preview, setPreview] = useState<string | null>(null);
  const [isIdentifying, setIsIdentifying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<PlantIdentification | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const { toast } = useToast();

  const handleIdentification = async (base64: string) => {
    setPreview(base64);
    try {
      setIsIdentifying(true);
      setProgress(0);
      const interval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 10, 90));
      }, 500);
      
      const identification = await identifyPlant(base64);
      clearInterval(interval);
      setProgress(100);
      setResult(identification);
    } catch (error) {
      clearPreview();
      toast({
        title: t('upload.error'),
        description: error instanceof Error ? error.message : t('upload.error'),
        variant: 'destructive',
      });
    } finally {
      setIsIdentifying(false);
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        onImageSelect?.(base64);
        await handleIdentification(base64);
      };
      reader.readAsDataURL(file);
    }
  }, [onImageSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp'],
    },
    maxFiles: 1,
    multiple: false,
    disabled: isIdentifying,
  });

  const clearPreview = () => {
    setPreview(null);
    setResult(null);
    setProgress(0);
  };

  const handleCameraCapture = async (imageData: string) => {
    onImageSelect?.(imageData);
    await handleIdentification(imageData);
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <AnimatePresence mode="wait">
        {showCamera && (
          <CameraCapture
            onCapture={handleCameraCapture}
            onClose={() => setShowCamera(false)}
          />
        )}
        
        {!preview ? (
          <motion.div
            key="dropzone"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            <div
              {...getRootProps()}
              className={cn(
                'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
                isDragActive
                  ? 'border-primary bg-primary/5'
                  : 'border-muted-foreground/25 hover:border-primary/50'
              )}
            >
              <input {...getInputProps()} />
              <div className="flex flex-col items-center gap-2">
                <Upload className="h-8 w-8 text-muted-foreground" />
                <p className="text-lg font-medium">
                  {t('upload.dropzone.title')}
                </p>
                <p className="text-sm text-muted-foreground">
                  {t('upload.dropzone.subtitle')}
                </p>
              </div>
            </div>

            <div className="flex justify-center">
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => setShowCamera(true)}
              >
                <Camera className="h-4 w-4" />
                {t('upload.takePhoto')}
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="preview"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            <div className="relative">
              <img
                src={preview}
                alt="Preview"
                className="w-full rounded-lg shadow-lg"
              />
              <div className="absolute top-4 right-4 flex gap-2">
                {!isIdentifying && (
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={clearPreview}
                    className="h-8 w-8"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            {isIdentifying && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <p className="text-sm">{t('upload.identifying')}</p>
                </div>
                <Progress value={progress} />
              </div>
            )}

            {result && <IdentificationResult result={result} />}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}