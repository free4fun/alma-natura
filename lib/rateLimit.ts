type RateLimitRecord = {
  count: number;
  start: number;
};

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 5;
const store = new Map<string, RateLimitRecord>();

export const checkRateLimit = (ip: string) => {
  const now = Date.now();
  const record = store.get(ip);

  if (!record) {
    store.set(ip, { count: 1, start: now });
    return { ok: true } as const;
  }

  if (now - record.start > RATE_LIMIT_WINDOW_MS) {
    store.set(ip, { count: 1, start: now });
    return { ok: true } as const;
  }

  if (record.count >= RATE_LIMIT_MAX) {
    return { ok: false } as const;
  }

  record.count += 1;
  store.set(ip, record);
  return { ok: true } as const;
};

export const rateLimitInfo = {
  windowMinutes: 10,
  maxRequests: RATE_LIMIT_MAX,
};
