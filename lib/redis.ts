import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: "https://mint-sloth-53255.upstash.io",
  token: process.env.NEXT_PUBLIC_REDIS_KEY,
});

export default redis;
