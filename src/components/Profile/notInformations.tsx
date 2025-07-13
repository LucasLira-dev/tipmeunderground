// src/app/profile/[userId]/page.tsx
'use client'


import { FaUser } from "react-icons/fa";

export default function NotInformations() {

    return (
        <main className="bg-[var(--midnight-black)] min-h-screen flex items-center justify-center p-4">
            <div className="max-w-md w-full text-center">
                
                {/* Ícone */}
                <div className="w-24 h-24 mx-auto mb-6 bg-gray-800 rounded-full flex items-center justify-center">
                    <FaUser className="text-3xl text-gray-500" />
                </div>

                {/* Título */}
                <h1 className="text-3xl font-bold text-white mb-4">
                    Perfil Não Configurado
                </h1>

                {/* Descrição */}
                <p className="text-gray-400 text-lg mb-8">
                    Este usuário ainda não possui dados salvos em seu perfil.
                </p>

            </div>
        </main>
    );
}