const TECHNICAL_PATTERNS = [
  /api key/i,
  /secret/i,
  /token/i,
  /stack/i,
  /mongo/i,
  /mongoose/i,
  /cast to/i,
  /objectid/i,
  /jwt/i,
  /stripe/i,
  /smtp/i,
  /nodemailer/i,
  /invalid login/i,
  /badcredentials/i,
  /network error/i,
  /timeout/i,
  /internal server error/i,
  /cannot read/i,
  /undefined/i,
  /null/i,
];

const FRIENDLY_MESSAGES: Array<[RegExp, string]> = [
  [/card|payment|stripe|api key|pk_test|paymentintent/i, 'Payment is temporarily unavailable. Please try Cash on Delivery or contact support.'],
  [/coupon/i, 'This coupon could not be applied. Please check the code and try again.'],
  [/stock|insufficient|left/i, 'Some items are no longer available in the requested quantity. Please update your cart.'],
  [/unauthorized|invalid token|token expired|jwt|login required/i, 'Please log in again to continue.'],
  [/forbidden|permission/i, 'You do not have permission to perform this action.'],
  [/email/i, 'Please enter a valid email address.'],
  [/password/i, 'Please check your password details and try again.'],
  [/not found/i, 'We could not find the requested information. Please check and try again.'],
  [/network|timeout/i, 'Connection problem. Please check your internet and try again.'],
  [/validation|required|invalid/i, 'Please check the highlighted information and try again.'],
];

const getRawMessage = (error: unknown): string => {
  if (!error) return '';
  if (typeof error === 'string') return error;
  if (error instanceof Error) return error.message;

  const maybeError = error as any;
  return (
    maybeError?.response?.data?.error ||
    maybeError?.response?.data?.message ||
    maybeError?.message ||
    ''
  );
};

export const toUserFriendlyError = (
  error: unknown,
  fallback = 'Something went wrong. Please try again.',
) => {
  const rawMessage = String(getRawMessage(error) || fallback).trim();
  const matchedFriendlyMessage = FRIENDLY_MESSAGES.find(([pattern]) => pattern.test(rawMessage));
  if (matchedFriendlyMessage) return matchedFriendlyMessage[1];

  if (TECHNICAL_PATTERNS.some((pattern) => pattern.test(rawMessage))) {
    return fallback;
  }

  return rawMessage || fallback;
};
