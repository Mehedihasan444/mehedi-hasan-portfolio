import { z } from "zod";

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(6),
  }),
});

export const createUserSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(6),
    name: z.string().min(2),
  }),
});

export type LoginInput = z.infer<typeof loginSchema.shape.body>;
export type CreateUserInput = z.infer<typeof createUserSchema.shape.body>;
