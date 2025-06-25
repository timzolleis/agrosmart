import { useTranslation } from 'react-i18next';
import { AgrosmartIcon } from '~/components/icons/agrosmart-icon';

export function Welcome() {
  const { t } = useTranslation('common');

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <AgrosmartIcon className="size-16 mb-6" />
      <h1 className="text-2xl font-medium text-gray-900 dark:text-gray-100 mb-2">
        {t('welcome.title')}
      </h1>
      <p className="text-lg text-gray-600 dark:text-gray-400">
        {t('welcome.subtitle')}
      </p>
    </div>
  );
}

