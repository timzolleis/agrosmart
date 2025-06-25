import { useTranslation } from 'react-i18next';
import { Calendar } from 'lucide-react';
import { Card, CardContent } from '~/components/ui/card';

export function EmptyState() {
  const { t } = useTranslation('pasture-journal');
  
  return (
    <Card className="text-center py-12">
      <CardContent>
        <div className="flex flex-col items-center gap-4">
          <Calendar className="h-12 w-12 text-muted-foreground" />
          <div>
            <h3 className="text-lg font-semibold">{t('list.empty.title')}</h3>
            <p className="text-muted-foreground">{t('list.empty.description')}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}