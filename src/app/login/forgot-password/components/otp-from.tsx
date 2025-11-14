"use client";

import { Dispatch, SetStateAction, useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Pages } from "../page";

type Props = {
  className?: React.ComponentProps<"div">;
  setPage: Dispatch<SetStateAction<Pages>>;
  props?: React.ComponentProps<"div">;
  email: string;
  role: string;
};

export function OTPForm({ email, role, className, setPage, ...props }: Props) {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(30);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const resendEmail = async () => {
    if (!canResend) return;

    setCanResend(false);
    setCountdown(30);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          role,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Houve um erro interno");
      }
    } catch (err) {
      const error = err as Error;
      console.log(err);
      setError(error.message);
      setPage("setRole");
    }
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (otp.length !== 6) {
      setError("Digite os 6 números do código.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/verify-code", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email,
          token: otp,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        setError(err.error || "Código inválido");
        return;
      }

      setPage("setNewPassword");
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
            {error && (
              <div className="w-max p-1 px-3 bg-red-400 border-1 border-[#ff6767] text-[#fff] rounded-[10px] text-[14px]">
                {error}
              </div>
            )}
            <h1 className="text-2xl font-bold">
              Insira o código de verificação
            </h1>
            <p className="text-muted-foreground text-sm text-balance">
              Nós enviamos um código de 6 dígitos para o seu email.
            </p>
          </div>

          <Field>
            <FieldLabel htmlFor="otp" className="sr-only">
              Código de verificação
            </FieldLabel>

            <div className="flex justify-center">
              <InputOTP
                value={otp}
                onChange={setOtp}
                maxLength={6}
                id="otp"
                required
              >
                <InputOTPGroup className="gap-2 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border">
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup className="gap-2 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border">
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup className="gap-2 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border">
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>

            <FieldDescription className="text-center">
              Digite o código de 6 dígitos enviado para o seu e-mail.
            </FieldDescription>
          </Field>

          <Button className="rounded-full" type="submit" disabled={loading}>
            {loading ? "Verificando..." : "Verificar"}
          </Button>

          <FieldDescription className="text-center">
            {canResend ? (
              <>
                Não recebeu o código?{" "}
                <button
                  type="button"
                  className="underline cursor-pointer"
                  onClick={() => resendEmail()}
                >
                  Reenviar
                </button>
              </>
            ) : (
              <>Reenviar código em {countdown}s</>
            )}
          </FieldDescription>
        </FieldGroup>
      </form>
    </div>
  );
}
