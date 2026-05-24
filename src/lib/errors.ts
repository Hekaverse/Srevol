/**
 * Safe error message helper.
 * Returns detailed errors in development, generic messages in production.
 * Prevents information disclosure (stack traces, DB errors, internal paths).
 */
export function safeError(
  publicMessage: string,
  internalError?: unknown
): string {
  if (process.env.NODE_ENV === "development" && internalError instanceof Error) {
    return internalError.message;
  }
  return publicMessage;
}

export function logError(context: string, error: unknown): void {
  console.error(`[${context}]`, error);
}
