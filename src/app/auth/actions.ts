"use server";

import { prisma } from "@/lib/db";
import { hashPassword, signIn } from "@/lib/auth";
import { registerSchema, loginSchema } from "@/lib/validators";
import { redirect } from "next/navigation";

type ActionState = { error?: string } | null;

export async function registerAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const rawData = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    role: formData.get("role") as string,
  };

  const parsed = registerSchema.safeParse(rawData);

  if (!parsed.success) {
    return { error: parsed.error.errors[0].message };
  }

  const { name, email, password, role } = parsed.data;

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return { error: "An account with this email already exists" };
  }

  // Hash password and create user
  const hashedPassword = await hashPassword(password);

  await prisma.user.create({
    data: {
      name,
      email,
      hashedPassword,
      role,
    },
  });

  redirect("/auth/login?registered=true");
}

export async function loginAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const rawData = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const parsed = loginSchema.safeParse(rawData);

  if (!parsed.success) {
    return { error: parsed.error.errors[0].message };
  }

  try {
    await signIn("credentials", {
      email: rawData.email,
      password: rawData.password,
      redirectTo: "/dashboard",
    });
  } catch (error) {
    // NextAuth throws a NEXT_REDIRECT error on success, which we need to rethrow
    if (error instanceof Error && error.message.includes("NEXT_REDIRECT")) {
      throw error;
    }
    return { error: "Invalid email or password" };
  }

  return null;
}
