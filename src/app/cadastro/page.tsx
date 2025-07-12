'use client'

import { useState, useEffect } from "react";

import { MdOutlineRemoveRedEye } from "react-icons/md";
import { FaRegEyeSlash } from "react-icons/fa";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { LoadingSpinner } from "@/components/Loading/spinner";
import Alert from "@/components/Alert/alert";



async function CadastrarUsuario(
    userData: {
        userName: string | FormDataEntryValue | null,
        userMail: string | FormDataEntryValue | null,
        userPassword: string | FormDataEntryValue | null
    },
    router: ReturnType<typeof useRouter>,
    setErro: (msg: string) => void
) {

    try {

         const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://tipme-backend.onrender.com';
    
        console.log("🔄 Tentando cadastrar em:", `${backendUrl}/users/register`);
        console.log("📦 Dados enviados:", userData);
        

        const response = await fetch(`${backendUrl}/users/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        })

        const data = await response.json();

        if (!response.ok) {
            setErro(data.message || 'Erro ao cadastrar usuário');
            throw new Error(data.message || 'Erro ao cadastrar usuário');
        }

        // ← Capturar o userId da resposta
        const userId = data.userId || data.user?.userId;
        console.log("UserId capturado:", userId); // Debug

        alert('Usuário cadastrado com sucesso!');

        // Login automático após cadastro bem-sucedido
        const result = await signIn("credentials", {
            redirect: false,
            userMail: userData.userMail,
            userPassword: userData.userPassword,
        });

        if (result?.ok) {
            router.push("/home"); // Redireciona para home após login
        }

        return data;
    } catch (error) {
        setErro('Erro desconhecido');
        console.error("Erro ao cadastrar usuário:", error);
    }
}

export default function CadastroPage() {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [erro, setErro] = useState("");
    const router = useRouter();
    const { data: session, status } = useSession();
    console.log("Sessão atual:", session); // Verifica se está salva
    console.log("Status:", status); 
    
    // Redireciona se já estiver autenticado
    useEffect(() => {
        if (status === "loading") return; // Ainda carregando
        if (session) {
            router.push("/home");
        }
    }, [session, status, router]);
    
    // Mostra loading enquanto verifica a sessão
    if (status === "loading") {
        return (
            <div className="flex items-center justify-center h-screen bg-black">
                <LoadingSpinner size="lg" text="Carregando..." />
            </div>
        );
    }
    
    // Se já está autenticado, não mostra a página
    if (session) {
        return null;
    }


    return (
        <div
        className="bg-black w-full h-screen flex items-center justify-center">
            { erro && (
                <div
                className="absolute top-4 left-1/2 transform -translate-x-1/2 w-[80vw] max-w-[400px]">
                    <Alert title="Erro ao cadastrar usuário" description={erro} onClose={() => setErro("")} />
                </div>
            )}
            <div
            className="bg-black/80 border border-sky-300/20 p-8 rounded-lg shadow-md flex flex-col items-center w-[320px] sm:min-w-md">
                <h1
                className="text-cyan-400 text-3xl font-bold mb-2"> Criar Conta </h1>
                <form
                    onSubmit={async (e) => {
                        e.preventDefault();
                        const form = e.currentTarget;
                        const formData = new FormData(form);
                        await CadastrarUsuario({
                            userName: formData.get('name'),
                            userMail: formData.get('email'),
                            userPassword: formData.get('password'),
                        }, router, setErro);
                    }}
                    className="w-full max-w-md mt-6 "
                >
                    <div className="mt-4">
                        <label className="block text-sky-200 mb-2">Nome</label>
                        <input
                            name="name"
                            type="text"
                            className="w-full p-2 bg-black/50 border border-sky-400/30 focus:border-sky-300 rounded focus:outline-none placeholder:text-sky-400/60 text-sky-100"
                            placeholder="Digite seu nome"
                            required
                        />
                    </div>

                    <div className="mt-4">
                        <label className="block text-sky-200 mb-2">Email</label>
                        <input
                            name="email"
                            type="email"
                            className="w-full p-2 bg-black/50 border border-sky-400/30 focus:border-sky-300 rounded focus:outline-none placeholder:text-sky-400/60 text-sky-100"
                            placeholder="Digite seu email"
                            required
                        />
                    </div>

                    <div className="mt-4">
                        <label className="block text-sky-200 mb-2">Senha</label>
                        <div className="relative">
                            <input
                                name="password"
                                type={passwordVisible ? "text" : "password"}
                                className="w-full p-2 pr-10 bg-black/50 border border-sky-400/30 focus:border-sky-300 rounded focus:outline-none placeholder:text-sky-400/60 text-sky-100"
                                placeholder="Digite sua senha"
                                required
                            />
                            <span 
                                onClick={() => setPasswordVisible(!passwordVisible)}
                                className="absolute inset-y-0 right-3 flex items-center cursor-pointer">
                                { passwordVisible ? <FaRegEyeSlash className="text-sky-400" /> : <MdOutlineRemoveRedEye className="text-sky-400" /> }
                            </span>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="mt-6 w-full bg-sky-400 hover:bg-sky-300 text-black font-semibold py-2 px-4 rounded-lg focus:border-sky-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition duration-200">
                           Criar Conta
                    </button>

                    <p
                        className="mt-4 text-sky-300 text-sm text-center">
                        Já tem uma conta? <Link href="/" className="text-sky-400 hover:text-sky-500">Faça login</Link>
                    </p>
                </form>
            </div>
        </div>
    )
}