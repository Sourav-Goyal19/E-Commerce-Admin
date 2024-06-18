import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: "https://unified-moose-49271.upstash.io",
  token: "AcB3AAIncDE5MGNlY2ViOGIzZjg0M2MxODM1NTMzYzQ0YjM4MjdhMHAxNDkyNzE",
});

export default redis;
