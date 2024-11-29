import { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UploadZone } from './upload-zone';
import { GalleryModal } from './gallery-modal';
import { useTranslation } from 'react-i18next';

export function Hero() {
  const { t } = useTranslation();
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  const handleImageSelect = (imageUrl: string) => {
    fetch(imageUrl)
      .then((response) => response.blob())
      .then((blob) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64data = reader.result as string;
          console.log('Selected image:', base64data);
        };
        reader.readAsDataURL(blob);
      });
  };

  return (
    <div className="container relative min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center gap-6 pb-8 pt-24 md:pb-12 md:pt-32 lg:py-32">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto flex max-w-[980px] flex-col items-center gap-4 text-center"
      >
        <h1 className="font-display text-4xl font-bold leading-tight tracking-tighter md:text-6xl lg:leading-[1.1]">
          {t('hero.title')}
          <br className="hidden sm:inline" />
          {t('hero.subtitle')}
        </h1>
        <p className="max-w-[750px] text-base text-muted-foreground sm:text-xl">
          {t('hero.description')}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="w-full max-w-3xl px-4 sm:px-6"
      >
        <UploadZone />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="flex flex-col gap-4 sm:flex-row"
      >
        <Button
          size="lg"
          variant="outline"
          className="gap-2"
          onClick={() => setIsGalleryOpen(true)}
        >
          <Upload className="h-4 w-4" />
          {t('hero.browseGallery')}
        </Button>
        <Button size="lg" variant="outline">
          {t('hero.learnMore')}
        </Button>
      </motion.div>

      <GalleryModal
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        onSelectImage={handleImageSelect}
      />
    </div>
  );
}