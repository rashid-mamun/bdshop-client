const rawGoogleClientId = (import.meta.env.VITE_GOOGLE_CLIENT_ID || '').trim();

const googleClientIdPattern = /^[0-9]+-[a-z0-9_-]+\.apps\.googleusercontent\.com$/i;

export const googleClientId = googleClientIdPattern.test(rawGoogleClientId)
  ? rawGoogleClientId
  : '';

export const isGoogleAuthConfigured = Boolean(googleClientId);
