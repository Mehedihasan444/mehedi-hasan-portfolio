import express, { type Express } from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import { env, getCorsOrigins } from "./config/env";
import { logger } from "./config/logger";
import { errorHandler } from "./middleware/error-handler";
import { notFoundHandler } from "./middleware/not-found";
import apiRoutes from "./modules";

const app: Express = express();

app.set("trust proxy", 1);

app.use(helmet());
app.use(
  cors({
    origin: (origin, cb) => {
      const allowed = getCorsOrigins();
      if (!origin || allowed.includes(origin)) return cb(null, true);
      return cb(new Error("CORS blocked"));
    },
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(compression());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.path === "/api/v1/health" || req.path === "/health",
});
app.use("/api/", limiter);

app.get("/api/v1/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/v1", apiRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

// On a long-running host (local dev, Docker, a VM) bind a port and serve.
// On Vercel the function is invoked per request and must export the app
// instead - calling listen() there keeps the invocation alive until it times
// out and the request fails. VERCEL is set automatically on their platform.
const isServerless = process.env.VERCEL === "1" || Boolean(process.env.AWS_LAMBDA_FUNCTION_NAME);

if (process.env.NODE_ENV !== "test" && !isServerless) {
  app.listen(env.PORT, () => {
    logger.info(`Server running on port ${env.PORT} in ${env.NODE_ENV} mode`);
  });
} else if (isServerless) {
  logger.info("Serverless mode: exporting app without binding a port");
}

export default app;
