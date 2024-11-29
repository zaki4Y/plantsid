import { useState, useRef, useEffect } from 'react';
import { Camera, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

interface CameraCaptureProps {
  onCapture: (imageData: string) => void;
  onClose: () => void;
}

export function CameraCapture({ onCapture, onClose }: CameraCaptureProps) {
  const { t } = useTranslation();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isFrontCamera, setIsFrontCamera] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [hasError, setHasError] = useState(false);

  const startCamera = async () => {
    try {
      setHasError(false);
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: isFrontCamera ? 'user' : 'environment' },
        audio: false,
      });
      setStream(newStream);
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setHasError(true);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const toggleCamera = async () => {
    stopCamera();
    setIsFrontCamera(!isFrontCamera);
    await startCamera();
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        const imageData = canvas.toDataURL('image/jpeg', 0.8);
        onCapture(imageData);
        stopCamera();
        onClose();
      }
    }
  };

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, [isFrontCamera]); // Re-run when camera mode changes

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
    >
      <div className="container flex flex-col items-center justify-center h-full max-w-lg mx-auto p-4">
        {hasError ? (
          <div className="text-center space-y-4">
            <p className="text-destructive">{t('camera.error')}</p>
            <Button
              variant="outline"
              className="rounded-full"
              onClick={onClose}
            >
              {t('camera.cancel')}
            </Button>
          </div>
        ) : (
          <>
            <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden bg-black">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="flex items-center justify-center gap-4 mt-4">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full h-12 w-12"
                onClick={toggleCamera}
              >
                <RefreshCcw className="h-6 w-6" />
              </Button>
              
              <Button
                size="icon"
                className="rounded-full h-16 w-16 bg-primary hover:bg-primary/90"
                onClick={capturePhoto}
              >
                <Camera className="h-8 w-8" />
              </Button>
              
              <Button
                variant="outline"
                className="rounded-full"
                onClick={() => {
                  stopCamera();
                  onClose();
                }}
              >
                {t('camera.cancel')}
              </Button>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}