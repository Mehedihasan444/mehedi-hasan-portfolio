/* eslint-disable @typescript-eslint/no-unused-vars */
declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV?: "development" | "production" | "test";
    PORT?: string;
    DATABASE_URL?: string;
    JWT_SECRET?: string;
    JWT_EXPIRES_IN?: string;
    CORS_ORIGIN?: string;
    UPLOAD_DIR?: string;
    CLOUDINARY_CLOUD_NAME?: string;
    CLOUDINARY_API_KEY?: string;
    CLOUDINARY_API_SECRET?: string;
    LOG_LEVEL?: string;
    ALLOW_PUBLIC_REGISTER?: string;
    ADMIN_EMAIL?: string;
    ADMIN_PASSWORD?: string;
  }
}

export {};
