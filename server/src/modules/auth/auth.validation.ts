import { z } from "zod";

export const loginSchema = z.object({
  body: z.object({
    email: z.string().trim().toLowerCase().email().max(254),
    password: z.string().min(6).max(128),
  }),
});

export const createUserSchema = z.object({
  body: z.object({
    email: z.string().trim().toLowerCase().email().max(254),
    password: z.string().min(8).max(128),
    name: z.string().trim().min(2).max(100),
  }),
});

export type LoginInput = z.infer<typeof loginSchema.shape.body>;
export type CreateUserInput = z.infer<typeof createUserSchema.shape.body>;
