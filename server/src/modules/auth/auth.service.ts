import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../../config/database";
import { env, allowPublicRegister } from "../../config/env";
import { AppError } from "../../middleware/error-handler";
import type { LoginInput, CreateUserInput } from "./auth.validation";

const DUMMY_HASH = "$2b$12$C6UzMDM.H6dfI/f/IKc8xej8xej8xej8xej8xej8xej8xej8xej8xe.";

function signToken(userId: string, role: string) {
  return jwt.sign({ userId, role }, env.JWT_SECRET, {
    algorithm: "HS256",
    expiresIn: env.JWT_EXPIRES_IN as unknown as number,
  });
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export class AuthService {
  async login(input: LoginInput) {
    const email = normalizeEmail(input.email);
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      await bcrypt.compare(input.password, DUMMY_HASH).catch(() => false);
      throw new AppError("Invalid email or password", 401);
    }

    const valid = await bcrypt.compare(input.password, user.password);
    if (!valid) {
      throw new AppError("Invalid email or password", 401);
    }

    const token = signToken(user.id, user.role);

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  async register(input: CreateUserInput) {
    if (!allowPublicRegister && env.NODE_ENV === "production") {
      throw new AppError("Public registration is disabled", 403);
    }

    const email = normalizeEmail(input.email);
    const existing = await prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      throw new AppError("Email already in use", 409);
    }

    const userCount = await prisma.user.count();
    const role = userCount === 0 ? "admin" : "user";

    const hashed = await bcrypt.hash(input.password, 12);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashed,
        name: input.name.trim(),
        role,
      },
    });

    const token = signToken(user.id, user.role);

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  async getMe(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, role: true },
    });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    return user;
  }
}

export const authService = new AuthService();
