import { z } from "zod";

export const emailSchema = z
  .string()
  .min(5, "O e-mail deve ter pelo menos 5 caracteres")
  .email("Formato de e-mail inválido")
  .regex(
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    "O e-mail deve conter um domínio válido"
  );

export function validateEmail(email: string) {
  const result = emailSchema.safeParse(email);
  if (!result.success) {
    return {
      valid: false,
      errors: result.error.errors.map((err) => err.message),
    };
  }
  return { valid: true, errors: [] };
}
