/**
 * Standalone version of TextAidBackground.friendlyError().
 * Returns a human-readable error message for AI provider failures.
 *
 * @param {string} provider - "OpenAI" | "Gemini" | "Claude"
 * @param {number} status   - HTTP status code (0 = network error)
 * @param {string} raw      - Raw response body text
 * @param {Headers} [headers] - Optional fetch Headers object
 */
export function friendlyError(provider, status, raw, headers) {
  let body = null;
  if (raw && typeof raw === "string") {
    try {
      body = JSON.parse(raw);
    } catch {
      /* not json */
    }
  }
  const apiErr = body?.error ? body.error : null;
  const apiMsg = apiErr?.message ? String(apiErr.message) : "";
  const apiCode = apiErr && (apiErr.code || apiErr.type) ? String(apiErr.code || apiErr.type) : "";
  const apiStatus = apiErr?.status ? String(apiErr.status) : "";

  let retryAfter = "";
  if (headers && typeof headers.get === "function") {
    const ra = headers.get("retry-after");
    if (ra) retryAfter = ` (retry in ~${Number(ra) || ra}s)`;
  }

  // Claude-specific error types
  if (provider === "Claude") {
    if (status === 401 || apiCode === "authentication_error") {
      return `Invalid Claude API key — check it in settings (must start with sk-ant-).`;
    }
    if (status === 403 || apiCode === "permission_error") {
      return `Claude API key does not have permission to use this model.`;
    }
    if (status === 404 || apiCode === "not_found_error") {
      return `Claude model not found — pick another model in the popup.`;
    }
    if (status === 429 || apiCode === "rate_limit_error") {
      return `Claude rate limit reached${retryAfter} — wait a moment and retry.`;
    }
    if (status === 529 || status === 503 || apiCode === "overloaded_error") {
      return `Claude is temporarily overloaded${retryAfter} — try again in a few seconds or switch to Haiku.`;
    }
    if (status === 400 || apiCode === "invalid_request_error") {
      return apiMsg
        ? `Claude rejected the request: ${apiMsg}`
        : `Claude request was invalid (400).`;
    }
  }

  if (
    status === 401 ||
    status === 403 ||
    apiStatus === "PERMISSION_DENIED" ||
    apiCode === "invalid_api_key"
  ) {
    return `Invalid or unauthorized ${provider} API key — check it in settings.`;
  }
  if (status === 404 || apiStatus === "NOT_FOUND" || apiCode === "model_not_found") {
    return `Model not found on ${provider} — pick another model in the popup.`;
  }
  if (status === 400 || apiStatus === "INVALID_ARGUMENT") {
    if (/context.*length|maximum.*tokens|too long/i.test(apiMsg)) {
      return `Selection too long for this model — shorten the text or pick a model with more context.`;
    }
    return apiMsg
      ? `${provider} rejected the request: ${apiMsg}`
      : `${provider} request was invalid (400).`;
  }
  if (status === 413) {
    return `Selection too large — shorten the text and retry.`;
  }
  if (status === 429 || apiStatus === "RESOURCE_EXHAUSTED" || apiCode === "rate_limit_exceeded") {
    if (apiCode === "insufficient_quota" || /quota|billing|credit/i.test(apiMsg)) {
      return `${provider} quota exceeded — add billing or wait for the quota to reset.`;
    }
    return `${provider} rate limit reached${retryAfter} — wait a moment, retry, or switch model/provider.`;
  }
  if (status === 503 || status === 502 || status === 504 || apiStatus === "UNAVAILABLE") {
    return `${provider} is temporarily overloaded${retryAfter} — try again in a few seconds, or switch to a lighter model (e.g. Flash / mini).`;
  }
  if (status === 500 || apiStatus === "INTERNAL") {
    return `${provider} hit an internal error — try again, or switch model if it persists.`;
  }
  if (status === 0) {
    return `Couldn't reach ${provider} — check your internet connection or firewall.`;
  }
  if (apiMsg) return `${provider}: ${apiMsg}`;
  return raw || `${provider} request failed (${status}).`;
}
