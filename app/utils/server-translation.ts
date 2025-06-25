import type { TFunction } from 'i18next';

export const mockServerTranslation: TFunction = (key: string) => {
  return key;
};