import { z } from "zod";

export const passwordSchema = z
  .string()
  .min(8, "A senha deve ter pelo menos 8 caracteres")
  .regex(/[a-z]/, "Deve conter ao menos uma letra minúscula")
  .regex(/[A-Z]/, "Deve conter ao menos uma letra maiúscula")
  .regex(/\d/, "Deve conter ao menos um número")
  .regex(/[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/, "Deve conter ao menos um símbolo");

export function validatePassword(password: string) {
  const result = passwordSchema.safeParse(password);
  if (!result.success) {
    return {
      valid: false,
      errors: result.error.errors.map((err) => err.message),
    };
  }
  return { valid: true, errors: [] };
}
