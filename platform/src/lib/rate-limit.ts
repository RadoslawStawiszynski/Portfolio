import { redis } from "./redis";

const LIMIT = 3;
const WINDOW_SECONDS = 900; // 15 minut

export async function checkRateLimit(
  ip: string
): Promise<{ allowed: boolean; remaining: number }> {
  const key = `rate-limit:contact:${ip}`;
  const count = await redis.incr(key);
  if (count === 1) {
    await redis.expire(key, WINDOW_SECONDS);
  }
  return {
    allowed: count <= LIMIT,
    remaining: Math.max(0, LIMIT - count),
  };
}

const WAITLIST_LIMIT = 3;
const WAITLIST_WINDOW_SECONDS = 3600; // 1 godzina

export async function checkWaitlistRateLimit(
  ip: string
): Promise<{ allowed: boolean; remaining: number }> {
  const key = `rate-limit:waitlist:${ip}`;
  const count = await redis.incr(key);
  if (count === 1) {
    await redis.expire(key, WAITLIST_WINDOW_SECONDS);
  }
  return {
    allowed: count <= WAITLIST_LIMIT,
    remaining: Math.max(0, WAITLIST_LIMIT - count),
  };
}
