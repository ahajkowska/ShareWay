export const SUPPORTED_CURRENCIES = [
  'USD',
  'EUR',
  'GBP',
  'PLN',
  'UAH',
  'RUB',
  'BYN',
  'KZT',
  'TRY',
  'JPY',
  'CNY',
] as const;

export type SupportedCurrency = (typeof SUPPORTED_CURRENCIES)[number];
