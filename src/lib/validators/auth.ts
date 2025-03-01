import { z } from "zod";

export const signinSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const createUserSchema = z.object({
  email: z.string().email(),
  name: z.string(),
  password: z.string(),
});

export const createUserUiSchema = z
  .object({
    email: z.string().email(),
    name: z.string(),
    password: z.string(),
    confirm_password: z.string(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });
