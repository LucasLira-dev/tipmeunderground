// src/app/home/homeClientPage.tsx
"use client"

import BotaoDialog from "@/components/Dialog/BotaoDialog";
import { signOut, useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { FaMusic, FaSignOutAlt, FaUser, FaExclamationTriangle } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { LoadingSpinner } from "@/components/Loading/spinner";

interface TokenPayload {
    userId: string;
}

export default function HomeClientPage() {
   const { data: session, status } = useSession();
   const [userId, setUserId] = useState<string | null>(null);
   const router = useRouter();

   // ← ADICIONAR: Redirecionar se não estiver autenticado
   useEffect(() => {
       if (status === "loading") return; // Aguarda verificação de sessão
       
       if (!session) {
           console.log("❌ Usuário não autenticado, redirecionando para /");
           router.push("/");
           return;
       }
   }, [session, status, router]);

   useEffect(() => {
       if (session?.accessToken) {
        try {
           const decoded = jwtDecode<TokenPayload>(session.accessToken);
           console.log("User ID:", decoded.userId);
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

   const limparAutenticacao = async () => {
    await signOut({ 
        redirect: false
    });
    
    localStorage.clear();
    sessionStorage.clear();
    
    window.location.href = '/';
   };

   

   const handleNavigateToProfile = () => {
       // Profile é público, navegar diretamente
       if (userId) {
           window.location.href = `/profile/${userId}`;
       } else {
           console.log("⚠️ Nenhum userId disponível para o perfil");
       }
   };

   // ← ADICIONAR: Mostrar loading enquanto verifica sessão
   if (status === "loading") {
       return (
           <div className="flex items-center justify-center h-screen bg-black">
               <LoadingSpinner size="lg" text="Carregando..." />
           </div>
       );
   }

   // ← ADICIONAR: Se não está autenticado, não mostra nada (está redirecionando)
   if (!session) {
       return null;
   }

   const userDisplayName = session?.user?.artistName || session?.user?.userName || "Artista";

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
                           {userDisplayName}
                       </span>
                   </h2>
                   <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
                       Sua plataforma para conectar-se com fãs, compartilhar sua arte e receber apoio para seus projetos musicais.
                   </p>
               </div>

               {/* Aviso sobre configuração */}
               <div className="bg-gradient-to-r from-orange-500/10 to-yellow-500/10 border border-orange-500/30 rounded-xl p-6 mb-8 max-w-4xl mx-auto">
                   <div className="flex items-center justify-center gap-3 mb-4">
                       <FaExclamationTriangle className="text-orange-400 text-2xl" />
                       <h3 className="text-xl font-semibold text-orange-300">Configure seu Perfil</h3>
                   </div>
                   <p className="text-gray-300 mb-4">
                       {/* eslint-disable-next-line react/no-unescaped-entities */}
                       Clique em "Configurar Perfil" para acessar as configurações e personalizar suas informações, 
                       links das redes sociais e dados para receber apoios.
                   </p>
                   
                   <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                     {/* <LoginDialog /> */}
                     <BotaoDialog/>

                       <button 
                           onClick={handleNavigateToProfile}
                           className="group flex items-center gap-3 bg-gray-700 border border-gray-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-600 transition-all">
                           <FaUser className="group-hover:scale-110 transition-transform" />
                           Ver Meu Perfil
                       </button>
                   </div>
               </div>

               {/* Lista de etapas */}
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
                   <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 text-center">
                       <div className="w-12 h-12 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                           <span className="text-cyan-400 font-bold text-xl">1</span>
                       </div>
                       <h4 className="text-white font-semibold mb-2">Informações Básicas</h4>
                       <p className="text-gray-400 text-sm">
                           Nome artístico, bio, foto de perfil
                       </p>
                   </div>

                   <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 text-center">
                       <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                           <span className="text-blue-400 font-bold text-xl">2</span>
                       </div>
                       <h4 className="text-white font-semibold mb-2">Redes Sociais</h4>
                       <p className="text-gray-400 text-sm">
                           Links do Instagram, Spotify, YouTube
                       </p>
                   </div>

                   <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 text-center">
                       <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                           <span className="text-green-400 font-bold text-xl">3</span>
                       </div>
                       <h4 className="text-white font-semibold mb-2">Dados do PIX</h4>
                       <p className="text-gray-400 text-sm">
                           Configure para receber apoios
                       </p>
                   </div>
               </div>

               {/* Call to action */}
               <div className="bg-gradient-to-r from-cyan-500/10 to-blue-600/10 border border-cyan-500/20 rounded-3xl p-8 flex flex-col justify-center items-center">
                   <h3 className="text-2xl font-bold text-white mb-4">
                       Pronto para configurar?
                   </h3>
                   <p className="text-gray-400 text-lg mb-6">
                       Acesse as configurações para personalizar seu perfil e começar a receber apoio dos seus fãs!
                   </p>
                    {/* <LoginDialog/>  */}
                    <BotaoDialog/>
               </div>
           </section>

       </div>
   )
}