import {
  BrowserClient,
  makeFetchTransport,
  defaultStackParser,
  defaultIntegrations,
} from '@sentry/browser';

let sentryTracker: BrowserClient | null;

export const initSentryTracker = (): BrowserClient => {
  return new BrowserClient({
    dsn: 'https://c170b1643b064f2cb57b2204e1e3bf5f@o4504239616294912.ingest.sentry.io/4504247590060032',
    transport: makeFetchTransport,
    stackParser: defaultStackParser,
    integrations: defaultIntegrations,
    tracesSampleRate: 1.0,
    release: '<VERSION>',
  });
};

export const getSentryTracker = (): BrowserClient => {
  if (!sentryTracker) {
    throw new Error('Sentry tracker is not set up!');
  }
  return sentryTracker;
};

export const init = (): void => {
  sentryTracker = initSentryTracker();
};
