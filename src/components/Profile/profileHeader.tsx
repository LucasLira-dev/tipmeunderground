import { PixDonationForm } from "./pixDonationForm";
import { useUserProfile } from "@/hooks/useProfile";

import Link from "next/link";

import { FaInstagram } from "react-icons/fa6";
import { AiOutlineYoutube, AiOutlineSpotify } from "react-icons/ai";
import { LoadingSpinner } from "../Loading/spinner";
import Image from "next/image";

interface ProfileHeaderProps {
  userId: string;
}

export default function ProfileHeader({ userId }: ProfileHeaderProps) {

  const { userData, loading, error } = useUserProfile(userId)


  if (loading) {
    return (
      <div className="border border-[var(--soft-presence)] bg-[var(--bg-secondary)] p-6 rounded-xl flex items-center justify-center">
        <LoadingSpinner size="lg" text="Carregando perfil..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="border border-[var(--soft-presence)] bg-[var(--bg-secondary)] p-6 rounded-xl">
        <p className="text-red-400 text-center">❌ {error}</p>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="border border-[var(--soft-presence)] bg-[var(--bg-secondary)] p-6 rounded-xl">
        <p className="text-gray-400 text-center">Perfil não encontrado</p>
      </div>
    );
  }

  return (
     <header className="border border-[var(--soft-presence)] bg-[var(--bg-secondary)] p-6 rounded-xl ">
      {/* ← CORRIGIR: Adicionar espaçamento e cores visíveis */}
      <article
      className="p-6 flex flex-col items-center md:flex-row md:gap-2">
      
      {/* ← AVATAR COM ASPECT-RATIO FIXO */}
        <div className="flex-shrink-0">
          <div className="w-30 h-30 rounded-full md:w-30 md:h-30 lg-w-40 lg-h-40 overflow-hidden border-4 border-[var(--bright-azure)] bg-gray-200 relative">
            <Image
              src={userData.userAvatar || "/avatar1.jpg"}
              alt={`Avatar de ${userData.artistName || "Usuário"}`}
              className="object-cover object-center"
            />
          </div>
        </div>

      <div
      className="flex flex-col items-center gap-2 mt-2 p-2 max-w-[500px] ">
        <h1 
        className="text-[var(--bright-azure)] text-[28px] font-bold">
            {userData.artistName}
        </h1>

        <p
        className="text-[var(--soft-cyan)] text-center font-medium text-[18px]">
            {userData.bio}
        </p>

        <div
        className="text-[#38BDF8] text-[18px] flex flex-col justify-center items-center gap-2 md:flex-row mt-2">
            <div
            className="flex gap-3 items-center">
              {userData.userLink1 && ( <Link
                href={userData.userLink1 || "#"}
                className="flex gap-1 items-center">
                    <FaInstagram className="hover:text-[#E1306C] transition-colors"/>
                    <p className="hover:text-[#E1306C] transition-colors">
                        {userData.artistName}
                    </p>
                </Link>
              )}

              { userData.userLink3 && (
                 <Link
                href={userData.userLink3 || "#"}
                className="flex gap-1 items-center">
                    <AiOutlineYoutube className="hover:text-[#E1306C] transition-colors"/>
                    <p className="hover:text-[#E1306C] transition-colors">
                        {userData.artistName}
                    </p>
                </Link>
              )}
               
                </div>

                <div className="flex gap-2 items-center ml-1">
                  { userData.userLink2 && (
                    <Link
                    href={userData.userLink2 || "#"}
                    className="flex gap-1 items-center">
                        <AiOutlineSpotify
                         className="hover:text-[#E1306C] transition-colors"/>
                        <p
                        className="hover:text-[#E1306C] transition-colors">
                             {userData.artistName}
                        </p>
                    </Link>
                  )}
                    
                </div>

        </div>
      </div>

        <PixDonationForm userId={userId} userName={userData.artistName} />
      </article>
    </header>  );
}