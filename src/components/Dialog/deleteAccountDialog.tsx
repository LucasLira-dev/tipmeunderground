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
import { useState } from "react";
import { useSession, signOut } from "next-auth/react"; // ← ADICIONAR signOut
import { FaRegEyeSlash } from "react-icons/fa";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { settingsService } from "@/services/settingsService"; // ← IMPORTAR O SERVICE

export function DeleteAccountDialog() {
  const { data: session } = useSession();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isOpen, setIsOpen] = useState(false); // ← CONTROLAR ABERTURA DO DIALOG

  // ← FUNÇÃO PARA DELETAR CONTA
  const handleDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validações
    if (!senha || !confirmarSenha) {
      setError("Preencha todos os campos");
      return;
    }

    if (senha !== confirmarSenha) {
      setError("As senhas não coincidem");
      return;
    }

    if (!session?.user?.email) {
      setError("Email não encontrado na sessão");
      return;
    }

    setLoading(true);
    setError("");

    try {

      // ← USAR O settingsService
      const response = await settingsService.deleteAccount(
        {
          userMail: session.user.email,    // ← EMAIL DA SESSÃO
          userPassword: senha           // ← SENHA DIGITADA
        },
        session.accessToken || ""
      );


      if (!response.ok) {
        const errorData = await response.json();
        console.error("❌ Erro da API:", errorData);
        throw new Error(errorData.message || "Erro ao deletar conta");
      }
      
      // ← FECHAR DIALOG E FAZER LOGOUT
      setIsOpen(false);
      
      // Mostrar mensagem de sucesso
      alert("Conta deletada com sucesso! Você será redirecionado.");
      
      // Fazer logout automático
      await signOut({ 
        callbackUrl: "/", // ← REDIRECIONAR PARA HOME
        redirect: true 
      });
      
    } catch (error) {
      console.error("❌ Erro ao deletar conta:", error);
      setError(error instanceof Error ? error.message : "Erro inesperado");
    } finally {
      setLoading(false);
    }
  };

  // ← RESETAR FORMULÁRIO AO FECHAR
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setSenha("");
      setConfirmarSenha("");
      setError("");
      setPasswordVisible(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <button className="max-w-[200px] flex items-center gap-2 font-semibold text-[var(--error-icon)] py-2 px-4 border-2 border-[var(--error-border)] rounded-lg focus:border-red-300 focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-200 cursor-pointer">
          <RiDeleteBin6Line />
          <p>Excluir Conta</p>
        </button>
      </DialogTrigger>
      
      <DialogContent className="bg-[var(--midnight-black)] border border-[var(--soft-presence)] [&>button]:text-white [&>button]:hover:bg-gray-700 [&>button]:p-2 [&>button]:rounded-md [&>button]:cursor-pointer">
        <form onSubmit={handleDeleteAccount}>
          <DialogHeader className="text-[var(--soft-cyan)]">
            <DialogTitle className="text-red-400 font-bold">
              ⚠️ Excluir Conta Permanentemente
            </DialogTitle>
            <DialogDescription className="text-gray-300">
              <strong>Esta ação não pode ser desfeita!</strong>
              <br />
              Todos os seus dados serão perdidos permanentemente.
              <br />
              <span className="text-sky-400 text-sm mt-2 block">
                📧 Conta: <strong>{session?.user?.email}</strong>
              </span>
            </DialogDescription>
          </DialogHeader>

          {/* ← MOSTRAR ERRO SE HOUVER */}
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-md mb-4">
              <p className="text-red-400 text-sm">❌ {error}</p>
            </div>
          )}

          <div className="grid gap-4 py-4">
            <div className="grid gap-3">
              <label className="text-[var(--soft-cyan)] text-[16px] font-semibold">
                Confirme sua senha
              </label>
              <div className="relative">
                <input
                  name="senha"
                  type={passwordVisible ? "text" : "password"}
                  className="w-full p-3 bg-black/50 border border-sky-400/30 focus:border-sky-300 rounded-md focus:outline-none placeholder:text-sky-400/60 text-sky-100"
                  placeholder="Digite sua senha"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  required
                  disabled={loading}
                />
                <span
                  onClick={() => setPasswordVisible(!passwordVisible)}
                  className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                >
                  {passwordVisible ? (
                    <FaRegEyeSlash className="text-sky-400" />
                  ) : (
                    <MdOutlineRemoveRedEye className="text-sky-400" />
                  )}
                </span>
              </div>
            </div>

            <div className="grid gap-3">
              <label className="text-[var(--soft-cyan)] text-[16px] font-semibold">
                Confirme novamente
              </label>
              <div className="relative">
                <input
                  name="confirmarSenha"
                  type={passwordVisible ? "text" : "password"}
                  className="w-full p-3 bg-black/50 border border-sky-400/30 focus:border-sky-300 rounded-md focus:outline-none placeholder:text-sky-400/60 text-sky-100"
                  placeholder="Confirme sua senha"
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          <DialogFooter className="flex gap-2">
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
              disabled={loading || !senha || !confirmarSenha}
              className="inline-flex items-center justify-center rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
            >
              {loading ? "Deletando..." : "🗑️ Deletar Definitivamente"}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}