import { Context, Hono } from "hono";
import { handle } from "hono/vercel";
import TestRouter from "./test";

export const runtime = "edge";

const app = new Hono().basePath("/api");

app
  .get("/hello", (c) => {
    return c.json({ message: "Hello World!" });
  })
  .route("/test", TestRouter);

export const GET = handle(app);
export const POST = handle(app);
