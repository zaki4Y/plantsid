import { X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

interface GalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectImage: (image: string) => void;
}

const SAMPLE_IMAGES = [
  {
    id: 1,
    url: 'https://images.unsplash.com/photo-1520412099551-62b6bafeb5bb?w=500&auto=format',
    alt: 'Snake Plant',
  },
  {
    id: 2,
    url: 'https://images.unsplash.com/photo-1463936575829-25148e1db1b8?w=500&auto=format',
    alt: 'Monstera',
  },
  {
    id: 3,
    url: 'https://images.unsplash.com/photo-1512428813834-c702c7702b78?w=500&auto=format',
    alt: 'Succulent',
  },
  {
    id: 4,
    url: 'https://images.unsplash.com/photo-1509423350716-97f9360b4e09?w=500&auto=format',
    alt: 'Fiddle Leaf Fig',
  },
];

export function GalleryModal({ isOpen, onClose, onSelectImage }: GalleryModalProps) {
  const { t } = useTranslation();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>{t('gallery.title')}</DialogTitle>
        </DialogHeader>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute right-4 top-4"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">{t('gallery.close')}</span>
        </Button>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          {SAMPLE_IMAGES.map((image) => (
            <div
              key={image.id}
              className="relative group cursor-pointer rounded-lg overflow-hidden"
              onClick={() => {
                onSelectImage(image.url);
                onClose();
              }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  onSelectImage(image.url);
                  onClose();
                }
              }}
            >
              <img
                src={image.url}
                alt={image.alt}
                className="w-full h-48 object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white font-medium">{image.alt}</span>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}