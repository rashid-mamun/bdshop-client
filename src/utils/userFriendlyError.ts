const TECHNICAL_PATTERNS = [
  /request failed/i,
  /status code/i,
  /axios/i,
  /err_/i,
  /econnrefused/i,
  /failed to fetch/i,
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
  [/invalid credentials|incorrect password|wrong password|invalid email or password|invalid login/i, 'Invalid email or password. Please try again.'],
  [/user already exists|email already in use|account already exists|duplicate/i, 'An account with this email already exists. Please sign in instead.'],
  [/user not found|account not found|no user found/i, 'No account found with this email address.'],
  [/unauthorized|invalid token|token expired|jwt|session expired|login required/i, 'Your session has expired. Please log in again to continue.'],
  [/forbidden|permission|not allowed|access denied/i, 'You do not have permission to perform this action.'],
  [/card|payment|stripe|api key|pk_test|paymentintent/i, 'Payment is temporarily unavailable. Please try Cash on Delivery or contact support.'],
  [/coupon/i, 'This coupon could not be applied. Please check the code and try again.'],
  [/stock|insufficient|sold out/i, 'Some items are no longer available in the requested quantity. Please update your cart.'],
  [/email/i, 'Please enter a valid email address.'],
  [/password/i, 'Please check your password details and try again.'],
  [/not found/i, 'We could not find the requested information. Please check and try again.'],
  [/network|timeout|connection|econnrefused|failed to fetch/i, 'Connection problem. Please check your internet connection and try again.'],
  [/validation|required|invalid/i, 'Please check the entered information and try again.'],
];

const extractErrorMessage = (error: unknown): { message: string; statusCode?: number } => {
  if (!error) return { message: '' };

  if (typeof error === 'string') {
    return { message: error };
  }

  const maybeError = error as any;
  const statusCode = maybeError?.response?.status || maybeError?.status;

  // Extract from Axios / API response first
  const responseData = maybeError?.response?.data;
  let backendMsg = '';

  if (typeof responseData === 'string') {
    backendMsg = responseData;
  } else if (responseData && typeof responseData === 'object') {
    backendMsg =
      responseData.error ||
      responseData.message ||
      (Array.isArray(responseData.details) ? responseData.details.join(', ') : '') ||
      '';
  }

  if (backendMsg && typeof backendMsg === 'string') {
    return { message: backendMsg, statusCode };
  }

  // Fallback to error message, but ignore generic Axios "Request failed with status code..."
  const rawMsg = maybeError?.message || (error instanceof Error ? error.message : '');
  if (rawMsg && !/request failed with status code/i.test(rawMsg)) {
    return { message: rawMsg, statusCode };
  }

  return { message: '', statusCode };
};

export const toUserFriendlyError = (
  error: unknown,
  fallback = 'Something went wrong. Please try again.',
): string => {
  const { message: rawMessage, statusCode } = extractErrorMessage(error);

  // If backend provided a specific clean message, match against friendly patterns first
  if (rawMessage) {
    const matchedFriendlyMessage = FRIENDLY_MESSAGES.find(([pattern]) => pattern.test(rawMessage));
    if (matchedFriendlyMessage) return matchedFriendlyMessage[1];

    // If it is a clean message (not technical/raw code/stack), return it directly
    if (!TECHNICAL_PATTERNS.some((pattern) => pattern.test(rawMessage))) {
      return rawMessage;
    }
  }

  // Handle standard HTTP status codes gracefully
  if (statusCode === 401) {
    return fallback.toLowerCase().includes('password') || fallback.toLowerCase().includes('email') || fallback.toLowerCase().includes('login')
      ? 'Invalid email or password. Please try again.'
      : 'Please sign in to continue.';
  }

  if (statusCode === 403) {
    return 'You do not have permission to perform this action.';
  }

  if (statusCode === 404) {
    return 'The requested resource could not be found.';
  }

  if (statusCode === 429) {
    return 'Too many requests. Please wait a moment and try again.';
  }

  if (statusCode && statusCode >= 500) {
    return 'Server is temporarily unavailable. Please try again in a few moments.';
  }

  return fallback;
};

