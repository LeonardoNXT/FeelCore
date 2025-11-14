"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Pages } from "../page";

type Props = {
  className?: React.ComponentProps<"div">;
  props?: React.ComponentProps<"div">;
  setPage: Dispatch<SetStateAction<Pages>>;
};

export function ResetPasswordComponent({
  className,
  setPage,
  ...props
}: Props) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    // VALIDAÇÕES
    if (password.length < 8) {
      setError("A senha deve ter no mínimo 8 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          newPassword: password,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        setError(err.message || "Erro ao alterar senha");
        return;
      }

      setPage("refreshPage");

      // Redirecionar após 2 segundos
      setTimeout(() => {}, 2000);
    } catch (error) {
      const err = error as Error;
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={handleSubmit}>
        <FieldGroup>
          <div className="flex flex-col items-center gap-1 text-center">
            <h1 className="text-2xl font-bold">Defina sua nova senha</h1>
            <p className="text-muted-foreground text-sm text-balance">
              Crie uma senha segura com no mínimo 8 caracteres.
            </p>
          </div>

          {error && (
            <div className="w-full p-1 px-3 bg-red-400 border-1 border-[#ff6767] text-[#fff] rounded-[10px] text-[14px]">
              {error}
            </div>
          )}

          <Field>
            <FieldLabel htmlFor="password">Nova senha</FieldLabel>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite sua nova senha"
              required
              className="rounded-full"
              minLength={6}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="confirmPassword">Confirmar senha</FieldLabel>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirme a senha digitada"
              required
              minLength={6}
              className="rounded-full"
            />
            <FieldDescription>
              Digite a mesma senha para confirmar.
            </FieldDescription>
          </Field>

          <Button
            className={`rounded-full ${
              !loading ? "cursor-pointer" : "cursor-not-allowed"
            }`}
            type="submit"
            disabled={loading}
          >
            {loading ? "Alterando..." : "Alterar senha"}
          </Button>
        </FieldGroup>
      </form>
    </div>
  );
}
