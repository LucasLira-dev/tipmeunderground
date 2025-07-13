'use client'

import { useState, useEffect } from "react"
import ProfileHeader from "@/components/Profile/profileHeader";
import { LoadingSpinner } from "@/components/Loading/spinner";

import { useUserProfile } from "@/hooks/useProfile";
import NotInformations from "@/components/Profile/notInformations";

type Props = {
    params: Promise<{
        userId: string;
    }>;
}

export default function UserProfilePage({ params }: Props) {
    const [userId, setUserId] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);

    const { userData, error, loading: profileLoading } = useUserProfile(userId)

    useEffect(() => {
        params.then(({ userId }) => {
            setUserId(userId);
            setLoading(false);
        });
    }, [params]);

    if (loading || profileLoading) {
        return (
            <div className="flex items-center justify-center h-screen bg-black">
                <LoadingSpinner size="lg" text="Carregando..." />
            </div>
        );
    }

      // ← CORRIGIR: Verificar se tem erro OU se não tem dados
    if (error || !userData || Object.keys(userData).length === 0) {
        return <NotInformations />;
    }

    // ← CORRIGIR: Verificar se tem dados essenciais antes de renderizar ProfileHeader
    const hasEssentialData = userData?.artistName || userData?.bio || userData?.userAvatar;
    
    if (!hasEssentialData) {
        return <NotInformations />;
    }

    return (
         <main className="bg-[var(--midnight-black)] flex items-center text-black min-h-screen flex-col p-2">
              <section className="flex flex-col p-4 gap-6 sm:max-w-[600px] md:max-w-[700px] lg:max-w-[900px] xl:max-w-[1000px]">
                <ProfileHeader 
                userId={userId} 
                avatar={userData?.userAvatar}
                artistName={userData?.artistName}
                bio={userData?.bio}
                userLink1={userData?.userLink1}
                userLink2={userData?.userLink2}
                userLink3={userData?.userLink3}
                />
              </section>
         </main>
    );
}