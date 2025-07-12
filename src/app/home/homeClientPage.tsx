"use client"

import { LoginDialog } from "@/components/Dialog/LoginDialog";
import { signOut, useSession } from "next-auth/react";
import { useState, useEffect } from "react";

import { jwtDecode } from "jwt-decode";
import Link from "next/link";
import { FaMusic, FaSignOutAlt, FaUser } from "react-icons/fa";

interface TokenPayload {
    userId: string;
}

export default function HomeClientPage() {

   const { data: session } = useSession();
   const [userId, setUserId] = useState<string | null>(null);

   useEffect(() => {
       if (session?.accessToken) {

        try {
           //decodificar o token JWT
           const decoded = jwtDecode<TokenPayload>(session.accessToken);
           console.log("User ID:", decoded.userId);

           //extrair o userId do token JWT
           const userIdFromToken = decoded.userId;
           console.log("User ID from token:", userIdFromToken);

           setUserId(userIdFromToken);
       } catch (error) {
           console.error("Erro ao decodificar o token JWT:", error);
           setUserId(null);
       }
    } else {
        console.log("Nenhum token JWT encontrado na sessão.");
        setUserId(null);
    }
   }, [session]);

        // Função para limpar tudo e redirecionar
    const limparAutenticacao = async () => {
    await signOut({ 
        redirect: false // Não redireciona automaticamente
    });
    
    // Opcional: limpar localStorage/sessionStorage também
    localStorage.clear();
    sessionStorage.clear();
    
    // Redirecionar manualmente
    window.location.href = '/cadastro';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
           {/* Header */}
           <header className="border-b border-gray-800 bg-black/50 backdrop-blur-md sticky top-0 z-50">
               <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
                   <div className="flex items-center gap-3">
                       <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
                           <FaMusic className="text-black text-lg" />
                       </div>
                       <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                           TipMe Underground
                       </h1>
                   </div>

                   <button 
                       onClick={limparAutenticacao}
                       className="flex items-center gap-2 text-gray-300 hover:text-red-400 transition-colors group">
                       <FaSignOutAlt className="group-hover:rotate-12 transition-transform" />
                       <span>Sair</span>
                   </button>
               </div>
           </header>

           {/* Hero Section */}
           <section className="max-w-6xl mx-auto px-4 py-16 text-center">
               <div className="mb-8">
                   <h2 className="text-5xl md:text-6xl font-bold text-white mb-4">
                       Bem-vindo, <br />
                       <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                           Estranho
                       </span>
                   </h2>
                   <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
                       Sua plataforma para conectar-se com fãs, compartilhar sua arte e receber apoio para seus projetos musicais.
                   </p>
               </div>

               {/* Action Buttons */}
               <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
                   <Link href={`/profile/${userId}`}>
                       <button className="group flex items-center gap-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:scale-105 transition-all shadow-lg hover:shadow-cyan-500/25">
                           <FaUser className="group-hover:scale-110 transition-transform" />
                           Ver Meu Perfil
                       </button>
                   </Link>

                    <LoginDialog/>
               </div>
           </section>
        </div>
    )
}