"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
// import Link from "next/link";
import { useState } from "react";
import { FaRegEyeSlash } from "react-icons/fa";
import { MdOutlineRemoveRedEye } from "react-icons/md";

import { SettingsAlert } from "@/components/Alert/SettingsAlert";

import { useRouter } from "next/navigation";

import { signIn } from "next-auth/react";  


interface ILoginDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function LoginDialog({open, onOpenChange}: ILoginDialogProps) {
  const [passwordVisible, setPasswordVisible] = useState(false);

  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")

  const [loading, setLoading] = useState(false);

   const [alertMessage, setAlertMessage] = useState<{ title: string; message: string; type: "success" | "error" } | null>(null);

  const router = useRouter()

  const confirmarLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

     try {
      // ← Usar signIn do NextAuth (muito mais simples!)
      const result = await signIn("credentials", {
        userMail: email,
        userPassword: senha,
        redirect: false, // Não redireciona automaticamente
      });

      console.log("Resultado do login:", result);

      if (result?.ok) {
        console.log("✅ Login realizado com sucesso!");
        setAlertMessage({
          title: "Sucesso",
          message: "Login realizado com sucesso!",
          type: "success",
        });

        setTimeout(()=> {
          if(onOpenChange) {
            onOpenChange(false);
          }
          router.push("/settings");
          window.location.href = "/settings"
        }, 1500) //espera 1.5 segundos antes de redirecionar

      } else {
        console.log("❌ Login falhou:", result?.error);
        setAlertMessage({
          title: "Erro",
          message: "❌ Credenciais inválidas. Verifique email e senha.",
          type: "error",
        });
      }

    } catch (error) {
      console.error("💥 Erro no login:", error);
      setAlertMessage({
        title: "Erro!",
        message: "Erro inesperado. Tente novamente.",
        type: "error",
    });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>

    {alertMessage && (
      <SettingsAlert
      title={alertMessage.title}
      message={alertMessage.message}
      type={alertMessage.type}
      onClose={()=> setAlertMessage(null)}
       />
    )}

    <Dialog
    open={open}
    onOpenChange={onOpenChange}>
        <DialogTrigger asChild>
          <button className=" bg-[#142B52] flex items-center gap-2 font-bold text-white px-8 py-4  border-2 border-[#041325] rounded-lg focus:border-[#041325] focus:outline-none focus:ring-2 focus:ring-[#041325] transition duration-200 cursor-pointer text-lg">
            Configurar Perfil
          </button>
        </DialogTrigger>
        <DialogContent className="bg-[var(--midnight-black)] border border-[var(--soft-presence)] [&>button]:text-white [&>button]:hover:bg-gray-700 [&>button]:p-2 [&>button]:rounded-md [&>button]:cursor-pointer">
        <form
        onSubmit={confirmarLogin}>
          <DialogHeader className="text-[var(--soft-cyan)]">
            <DialogTitle> Confirme Seus Dados </DialogTitle>
            <DialogDescription>
              Informe seu Email e Senha para poder continuar
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
                />
                <span
                  onClick={() => setPasswordVisible(!passwordVisible)}
                  className="absolute inset-y-0 right-3 flex items-center justify-center cursor-pointer"
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
                className="inline-flex items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium text-sky-100 hover:bg-sky-500/10 focus:outlinenone focus:ring-2 focus:ring-sky-500/50 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
              >
                Cancelar
              </button>
            </DialogClose>
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-md bg-sky-500 px-4 py-2 text-sm font-medium text-white hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
              onClick={(e) => confirmarLogin(e)}
            >
              { loading ? "Entrando..." : "Entrar" }
            </button>
          </DialogFooter>
        </form>
        </DialogContent>
      
    </Dialog>
    </>
  );
}