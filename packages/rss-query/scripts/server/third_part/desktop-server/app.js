const Koa = require("koa");
const path = require("path");
const bodyparser = require("koa-bodyparser");
const json = require("koa-json");
const onerror = require("koa-onerror");
const logger = require("koa-logger");
const compress = require("koa-compress");
const cookie = require("koa-cookie").default;
const cors = require("@koa/cors");
const fs = require("fs");
const { rss } = require("./router/rss");
const { opml } = require("./router/opml");
const { setting } = require("./router/setting");
const { cron } = require("./router/cron");

const app = new Koa();
onerror(app);

app.use(logger());
app.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  console.log(`customised log: ${ctx.method} ${ctx.url} - ${ms}ms`);
});
app.use(
  cors({
  })
);
app.use(compress());
app.use(cookie());
app.use(
  bodyparser({
    enableTypes: ["json", "form", "text"],
  })
);
app.use(rss.routes(), rss.allowedMethods());
app.use(opml.routes(), opml.allowedMethods());
app.use(setting.routes(), setting.allowedMethods());
app.use(cron.routes(), cron.allowedMethods());
app.use(async (ctx, next) => {
  if (!ctx.body) {
    ctx.set("Content-Type", "text/html; charset=utf-8");
    ctx.set("cache-control", "max-age=0");
    ctx.status = 404;
    ctx.body = 'oh no! 404!';
  }
  await next();
});

app.use(json());
app.on("error", (err, ctx) => {
  console.error("server error", err);
});

module.exports = app;
