export const TOKEN_EXPIRY = {
  ACCESS_TOKEN_EXPIRY: '15m',
  REFRESH_TOKEN_EXPIRY: '7d',
  ACCESS_TOKEN_MS: 15 * 60 * 1000, // 15 minutes
  REFRESH_TOKEN_MS: 7 * 24 * 60 * 60 * 1000, // 7 days
} as const;

export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  domain: process.env.COOKIE_DOMAIN || undefined,
};

export const COOKIE_NAMES = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
} as const;
