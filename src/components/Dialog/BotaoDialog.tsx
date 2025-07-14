// src/components/Botoes/BotaoConfigurarPerfil.tsx
"use client";
import { useSession } from "next-auth/react";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LoginDialog } from "@/components/Dialog/LoginDialog";

interface TokenPayload {
  exp: number;
}

export default function BotaoDialog() {
  const { data: session } = useSession();
  const router = useRouter();
  const [showDialog, setShowDialog] = useState(false);

  const handleClick = () => {
    const token = session?.accessToken;
    if (!token) {
      setShowDialog(true);
      return;
    }
    try {
      const decoded = jwtDecode<TokenPayload>(token);
      const now = Date.now() / 1000;
      if (decoded.exp > now) {
        router.push("/settings");
      } else {
        setShowDialog(true);
      }
    } catch {
      setShowDialog(true);
    }
  };

  return (
    <>
      <button
        className="bg-[#142B52] flex items-center gap-2 font-bold text-white px-8 py-4 border-2 border-[#041325] rounded-lg focus:border-[#041325] focus:outline-none focus:ring-2 focus:ring-[#041325] transition duration-200 cursor-pointer text-lg"
        onClick={handleClick}
      >
        Configurar Perfil
      </button>
      {showDialog && (
        <LoginDialog open={showDialog} onOpenChange={setShowDialog} />
      )}
    </>
  );
}