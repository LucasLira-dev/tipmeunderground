import { PixDonationForm } from "./pixDonationForm";

import Link from "next/link";

import { FaInstagram } from "react-icons/fa6";
import { AiOutlineYoutube, AiOutlineSpotify } from "react-icons/ai";
import Image from "next/image";

interface ProfileHeaderProps {
  userId: string;
  avatar?: string | null;
  artistName?: string | null;
  bio?: string | null;
  userLink1?: string | null;
  userLink2?: string | null;
  userLink3?: string | null;
}

export default function ProfileHeader({ userId, avatar, artistName, bio, userLink1, userLink2, userLink3 }: ProfileHeaderProps) {

  return (
     <header className="border border-[var(--soft-presence)] bg-[var(--bg-secondary)] p-6 rounded-xl ">
      {/* ← CORRIGIR: Adicionar espaçamento e cores visíveis */}
      <article
      className="p-6 flex flex-col items-center md:flex-row md:gap-2">
      
      {/* ← AVATAR COM ASPECT-RATIO FIXO */}
        <div className="flex-shrink-0">
          <div className="w-30 h-30 rounded-full md:w-30 md:h-30 lg-w-40 lg-h-40 overflow-hidden border-4 border-[var(--bright-azure)] bg-gray-200 relative">
            <Image
              width={160}
              height={160}
              src={avatar || "/avatar1.jpg"}
              alt={`Avatar de ${artistName || "Usuário"}`}
              className="object-cover object-center"
            />
          </div>
        </div>

      <div
      className="flex flex-col items-center gap-2 mt-2 p-2 max-w-[500px] ">
        <h1 
        className="text-[var(--bright-azure)] text-[28px] font-bold">
            {artistName || "Nome do Artista"}
        </h1>

        <p
        className="text-[var(--soft-cyan)] text-center font-medium text-[18px]">
            {bio || "Esta pessoa ainda não possui uma biografia configurada."}
        </p>

        <div
        className="text-[#38BDF8] text-[22px] w-full max-w-sm lg:max-w-none flex flex-col justify-center items-center gap-2 md:flex-row mt-2">
            <div
            className="flex gap-3 items-center">
              {userLink1 && ( <Link
                href={userLink1 || "#"}
                className="flex gap-1 items-center">
                    <FaInstagram className="hover:text-[#E1306C] transition-colors"/>
                    {/* <p className="hover:text-[#E1306C] transition-colors">
                        {artistName}
                    </p> */}
                </Link>
              )}

              { userLink3 && (
                 <Link
                href={userLink3 || "#"}
                className="flex gap-1 items-center">
                    <AiOutlineYoutube className="hover:text-[#E1306C] transition-colors"/>
                    {/* <p className="hover:text-[#E1306C] transition-colors">
                        {artistName}
                    </p> */}
                </Link>
              )}
               
                </div>

                <div className="flex gap-2 items-center ml-1">
                  { userLink2 && (
                    <Link
                    href={userLink2 || "#"}
                    className="flex gap-1 items-center">
                        <AiOutlineSpotify
                         className="hover:text-[#E1306C] transition-colors"/>
                        {/* <p
                        className="hover:text-[#E1306C] transition-colors">
                             {artistName}
                        </p> */}
                    </Link>
                  )}   
                </div>
        </div>
      </div>

        <PixDonationForm userId={userId} userName={artistName} />
      </article>
    </header>  );
}