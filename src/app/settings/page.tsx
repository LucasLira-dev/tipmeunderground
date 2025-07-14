// src/app/settings/page.tsx
"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { LoadingSpinner } from "@/components/Loading/spinner";
import { SettingsAlert } from "@/components/Alert/SettingsAlert";
import { useSettingsForm } from "@/hooks/useSettingsForm";
import { useAvatarSettings } from "@/hooks/useAvatarSettings";

// ← Importar componentes
import { SettingsHeader } from "@/components/Settings/SettingsHeader";
import { AvatarSection } from "@/components/Settings/AvatarSection";
import { ProfileInfoForm } from "@/components/Settings/ProfileInfoForm";
import { SocialLinksForm } from "@/components/Settings/SocialLinksForm";
import { AccountSettingsForm } from "@/components/Settings/AccountSettingsForm";
import { PaymentSettingsForm } from "@/components/Settings/PaymentSettingsForm";
import { SettingsActions } from "@/components/Settings/SettingsActions";  

import { useRouter } from "next/navigation"
import { jwtDecode } from "jwt-decode";

interface TokenPayload {
  exp: number;
}

export default function SettingsPage() {
   const { status, data: session } = useSession();
  const router = useRouter();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [verificandoToken, setVerificandoToken] = useState(true);

  // Verificação do token
  useEffect(() => {
    if (status === "loading") return;

    //se 
    if (!session?.accessToken) {
      router.push("/home");
      return;
    }

    try {
      const decoded = jwtDecode<TokenPayload>(session.accessToken);
      const now = Date.now() / 1000;
      if (decoded.exp <= now) {
        router.push("/home");
        return;
      }
    } catch {
      router.push("/home");
      return;
    }
    setVerificandoToken(false);
  }, [session, status, router]);
  
  const {
    formData,
    loading,
    paginaCarregada,
    alertMessage,
    handleSave,
    updateField,
    closeAlert,
  } = useSettingsForm();

  const {
    avatarAtual,
    avatarSelecionado,
    salvandoAvatar,
    avatarMudou,
    handleAvatarSelect,
    handleAtualizarAvatar,
  } = useAvatarSettings();

  const avatars = [
    "/avatar1.jpg", "/avatar2.jpg"
  ];

  console.log("Status:", status, "Página carregada:", paginaCarregada); // ← DEBUG

  if (!paginaCarregada || verificandoToken) {
    console.log("mostrando loading")
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <LoadingSpinner size="lg" text="Carregando..." />
      </div>
    );
  }

  console.log("Renderizando página..."); // ← DEBUG

  return (
    <main className="bg-[var(--midnight-black)] flex items-center text-black min-h-screen flex-col p-2">
      
      {alertMessage && (
        <SettingsAlert
          type={alertMessage.type}
          title={alertMessage.title}
          message={alertMessage.message}
          onClose={closeAlert}
        />
      )}

      <section className="flex flex-col p-4 gap-6 sm:max-w-[600px] md:max-w-[700px] lg:max-w-[900px] xl:max-w-[1000px]">
        
        <SettingsHeader />
        
        <AvatarSection
          avatarAtual={avatarAtual}
          avatarSelecionado={avatarSelecionado}
          salvandoAvatar={salvandoAvatar}
          avatarMudou={avatarMudou}
          avatars={avatars}
          onAvatarSelect={handleAvatarSelect} // ← CORRIGIDO
          onUpdateAvatar={handleAtualizarAvatar} // ← CORRIGIDO
        />
        
        <ProfileInfoForm
          nomeArtistico={formData.nomeArtistico}
          userName={formData.userName}
          bio={formData.bio}
          onUpdateField={updateField}
        />
        
        <SocialLinksForm
          instagram={formData.instagram}
          spotify={formData.spotify}
          youtube={formData.youtube}
          // soundcloud={formData.soundcloud}
          onUpdateField={updateField}
        />
        
        <AccountSettingsForm
          email={formData.email}
          senhaAtual={formData.senhaAtual}
          senhaNova={formData.senhaNova}
          confirmarSenha={formData.confirmarSenha}
          passwordVisible={passwordVisible}
          onUpdateField={updateField}
          onTogglePasswordVisibility={() => setPasswordVisible(!passwordVisible)}
        />
        
        <PaymentSettingsForm
          pixKey={formData.pixKey}
          pixKeyType={formData.pixKeyType}
          pixName={formData.pixName}
          pixCity={formData.pixCity}
          onUpdateField={updateField}
        />
        
        <SettingsActions
          loading={loading}
          onSave={handleSave}
        />
        
      </section>
    </main>
  );
}