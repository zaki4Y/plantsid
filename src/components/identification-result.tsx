import { motion } from 'framer-motion';
import { Leaf, Droplets, Sun, Sprout } from 'lucide-react';
import type { PlantIdentification } from '@/lib/plant-service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';

interface IdentificationResultProps {
  result: PlantIdentification;
}

export function IdentificationResult({ result }: IdentificationResultProps) {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl mx-auto space-y-4"
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Leaf className="h-5 w-5 text-primary" />
            {result.name}
          </CardTitle>
          <div className="text-sm text-muted-foreground">
            {result.commonNames.join(', ')}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">{t('plantInfo.about')}</h3>
            <p className="text-sm text-muted-foreground">{result.description}</p>
          </div>
          
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="p-4">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Droplets className="h-4 w-4 text-blue-500" />
                  {t('plantInfo.watering')}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-sm text-muted-foreground">
                  {result.careInstructions.watering || t('plantInfo.noInfo.watering')}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="p-4">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Sun className="h-4 w-4 text-yellow-500" />
                  {t('plantInfo.sunlight')}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-sm text-muted-foreground">
                  {result.careInstructions.sunlight || t('plantInfo.noInfo.sunlight')}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="p-4">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Sprout className="h-4 w-4 text-green-500" />
                  {t('plantInfo.soil')}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-sm text-muted-foreground">
                  {result.careInstructions.soil || t('plantInfo.noInfo.soil')}
                </p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}