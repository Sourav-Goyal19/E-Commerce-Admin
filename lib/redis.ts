import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: "https://unified-moose-49271.upstash.io",
  token: process.env.NEXT_PUBLIC_REDIS_KEY,
});

export default redis;
