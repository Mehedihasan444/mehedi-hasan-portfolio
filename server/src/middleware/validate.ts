import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";
import { AppError } from "./error-handler";

export const validate = (schema: ZodSchema) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      const parsed = schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      }) as { body?: unknown; query?: unknown; params?: unknown };
      if (parsed && typeof parsed === "object") {
        if (parsed.body !== undefined) req.body = parsed.body;
        if (parsed.query !== undefined) req.query = parsed.query as Request["query"];
        if (parsed.params !== undefined) req.params = parsed.params as Request["params"];
      }
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const messages = error.issues.map((e) => `${e.path.join(".")}: ${e.message}`);
        return next(new AppError(messages.join("; "), 400));
      }
      next(error);
    }
  };
};
