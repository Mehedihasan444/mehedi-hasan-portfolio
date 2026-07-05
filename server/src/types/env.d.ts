// See https://kit.svelte.dev/docs/typescript for more information
// (not actually using Svelte, but the config pattern is valid for Node)

export {};

// src/config/env.ts
export interface EnvConfig {
  NODE_ENV: "development" | "production" | "test";
  PORT: number;
  DATABASE_URL: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  CORS_ORIGIN: string;
  UPLOAD_DIR: string;
  LOG_LEVEL: string;
}
