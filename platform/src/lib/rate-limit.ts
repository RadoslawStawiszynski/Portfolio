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
