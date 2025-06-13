import { HydratedRouter } from 'react-router/dom';

import i18n from '~/lib/localization/i18n';

import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from "i18next-http-backend";
import { StrictMode, startTransition } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { initReactI18next } from 'react-i18next';
import { getInitialNamespaces } from 'remix-i18next/client';

async function hydrate() {
  await i18next
    .use(initReactI18next)
    .use(LanguageDetector)
    .use(Backend)
    .init({
      ...i18n,
      ns: getInitialNamespaces(),
      backend: { loadPath: '/locales/{{lng}}/{{ns}}.json' },
      detection: {
        order: ['htmlTag'],

        caches: [],
      },
    });

  startTransition(() => {
    hydrateRoot(
      document,
      <StrictMode>
        <HydratedRouter />
      </StrictMode>,
    );
  });
}
if (window.requestIdleCallback) {
  window.requestIdleCallback(hydrate);
} else {
  // Safari doesn't support requestIdleCallback
  // https://caniuse.com/requestidlecallback
  window.setTimeout(hydrate, 1);
}