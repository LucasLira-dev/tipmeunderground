"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { FaRegEyeSlash } from "react-icons/fa";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { SettingsAlert } from "@/components/Alert/SettingsAlert";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { jwtDecode } from "jwt-decode";

interface TokenPayload {
  userId: string;
  exp: number;
}

interface ILoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClose?: () => void;
}

export function LoginDialog({ open, onOpenChange, onClose }: ILoginDialogProps) {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState<{ title: string; message: string; type: "success" | "error" } | null>(null);
  const [isTokenExpired, setIsTokenExpired] = useState(true);

  const router = useRouter();
  const { data: session } = useSession();

  // Verifica o token sempre que abrir o dialog
  useEffect(() => {
    if (!open) return;

    if (!session?.accessToken) {
      setIsTokenExpired(true);
      return;
    }

    try {
      const decoded = jwtDecode<TokenPayload>(session.accessToken);
      const currentTime = Date.now() / 1000;
      if (decoded.exp > currentTime) {
        setIsTokenExpired(false);
        // Token válido, fecha o dialog e redireciona
        if (onClose) onClose();
        onOpenChange(false);
        router.push("/settings");
      } else {
        setIsTokenExpired(true);
      }
    } catch {
      setIsTokenExpired(true);
    }
  }, [open, session, onClose, onOpenChange, router]);

  const confirmarLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        userMail: email,
        userPassword: senha,
        redirect: false,
      });

      if (result?.ok) {
        setAlertMessage({
          title: "Sucesso",
          message: "Login realizado com sucesso!",
          type: "success",
        });

        setTimeout(() => {
          if (onClose) onClose();
          onOpenChange(false);
          router.push("/settings");
        }, 1500);
      } else {
        setAlertMessage({
          title: "Erro",
          message: "❌ Credenciais inválidas. Verifique email e senha.",
          type: "error",
        });
      }
    } catch (error) {
      setAlertMessage({
        title: "Erro!",
        message: error instanceof Error ? error.message : "Erro inesperado. Tente novamente.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // Só renderiza o dialog se o token estiver expirado ou ausente
  if (!open || !isTokenExpired) return null;

  return (
    <>
      {alertMessage && (
        <SettingsAlert
          title={alertMessage.title}
          message={alertMessage.message}
          type={alertMessage.type}
          onClose={() => setAlertMessage(null)}
        />
      )}

      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="bg-[var(--midnight-black)] border border-[var(--soft-presence)] [&>button]:text-white [&>button]:hover:bg-gray-700 [&>button]:p-2 [&>button]:rounded-md [&>button]:cursor-pointer">
          <form onSubmit={confirmarLogin}>
            <DialogHeader className="text-[var(--soft-cyan)]">
              <DialogTitle>Confirme Seus Dados</DialogTitle>
              <DialogDescription>
                Sua sessão expirou. Informe seu Email e Senha para continuar
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-2 mt-3">
              <div className="grid gap-1">
                <label className="text-[var(--soft-cyan)] text-[16px] font-semibold">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={email}
                  placeholder="Digite seu email"
                  className="w-full p-2 bg-black/50 border border-sky-400/30 focus:border-sky-300 rounded-md focus:outline-none placeholder:text-sky-400/60 text-sky-100 mt-2"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              <div className="grid gap-1">
                <label className="text-[var(--soft-cyan)] text-[16px] font-semibold">
                  Senha
                </label>
                <div className="relative">
                  <input
                    name="senha"
                    type={passwordVisible ? "text" : "password"}
                    value={senha}
                    className="w-full p-2 bg-black/50 border border-sky-400/30 focus:border-sky-300 rounded-md focus:outline-none placeholder:text-sky-400/60 text-sky-100 mt-2"
                    placeholder="Digite sua senha"
                    required
                    onChange={(e) => setSenha(e.target.value)}
                    disabled={loading}
                  />
                  <span
                    onClick={() => !loading && setPasswordVisible(!passwordVisible)}
                    className={`absolute inset-y-0 right-3 flex items-center justify-center ${loading ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    {passwordVisible ? (
                      <FaRegEyeSlash className="text-sky-400" />
                    ) : (
                      <MdOutlineRemoveRedEye className="text-sky-400" />
                    )}
                  </span>
                </div>
              </div>
            </div>
            <DialogFooter className="flex mt-4">
              <DialogClose asChild>
                <button
                  type="button"
                  disabled={loading}
                  className="inline-flex items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium text-sky-100 hover:bg-sky-500/10 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                >
                  Cancelar
                </button>
              </DialogClose>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center rounded-md bg-sky-500 px-4 py-2 text-sm font-medium text-white hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
              >
                {loading ? "Entrando..." : "Entrar"}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}