import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: "https://mint-sloth-53255.upstash.io",
  token: "AdAHAAIncDE5YmIzM2QxMDZkODE0ZGZiOWUzOTBjNGE5ZThkZTY1ZXAxNTMyNTU",
});

export default redis;
