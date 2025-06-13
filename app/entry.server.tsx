import type { AppLoadContext, EntryContext } from 'react-router';
import { ServerRouter } from 'react-router';

import i18n from '~/lib/localization/i18n';
import i18next from '~/lib/localization/i18n.server';

import { createReadableStreamFromReadable } from '@react-router/node';
import { createInstance } from 'i18next';
import Backend from 'i18next-fs-backend';
import { isbot } from 'isbot';
import { resolve as resolvePath } from 'node:path';
import { PassThrough } from 'node:stream';
import type { RenderToPipeableStreamOptions } from 'react-dom/server';
import { renderToPipeableStream } from 'react-dom/server';
import { I18nextProvider, initReactI18next } from 'react-i18next';

export const streamTimeout = 12_000;

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  routerContext: EntryContext,
  loadContext: AppLoadContext,
) {
  return new Promise(async (resolve, reject) => {
    const i18nextInstance = createInstance();
    const lng = await i18next.getLocale(request);
    const namespaces = i18next.getRouteNamespaces(routerContext);

    await i18nextInstance
      .use(initReactI18next)
      .use(Backend)
      .init({
        ...i18n,
        lng,
        ns: namespaces,
        backend: {
          loadPath: resolvePath('./public/locales/{{lng}}/{{ns}}.json'),
        },
      });
    let shellRendered = false;
    const userAgent = request.headers.get('user-agent');

    // Ensure requests from bots and SPA Mode renders wait for all content to load before responding
    // https://react.dev/reference/react-dom/server/renderToPipeableStream#waiting-for-all-content-to-load-for-crawlers-and-static-generation
    const readyOption: keyof RenderToPipeableStreamOptions =
      (userAgent && isbot(userAgent)) || routerContext.isSpaMode ? 'onAllReady' : 'onShellReady';

    const { pipe, abort } = renderToPipeableStream(
      <I18nextProvider i18n={i18nextInstance}>
        <ServerRouter context={routerContext} url={request.url} />
      </I18nextProvider>,
      {
        [readyOption]() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);

          responseHeaders.set('Content-Type', 'text/html');

          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode,
            }),
          );

          pipe(body);
        },
        onShellError(error: unknown) {
          reject(error);
        },
        onError(error: unknown) {
          responseStatusCode = 500;
          // Log streaming rendering errors from inside the shell.  Don't log
          // errors encountered during initial shell rendering since they'll
          // reject and get logged in handleDocumentRequest.
          if (shellRendered) {
            console.error(error);
          }
        },
      },
    );

    // Abort the rendering stream after the `streamTimeout` so it has time to
    // flush down the rejected boundaries
    setTimeout(abort, streamTimeout + 1000);
  });
}

process.on('unhandledRejection', (reason: unknown, p: Promise<unknown>) => {
  console.error('Unhandled Rejection at:', p, 'reason:', reason);

  let stack = '';
  if (reason && reason instanceof Error && reason.stack) {
    stack = reason.stack;
  } else if (typeof reason === 'string') {
    stack = reason;
  } else {
    stack = JSON.stringify(reason);
  }
  console.error('Unhandled Promise Rejection', { reason, stack, promise: p });
});
