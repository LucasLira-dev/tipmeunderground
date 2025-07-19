// src/hooks/useAvatarSettings.ts
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { settingsService } from "@/services/settingsService";

interface AlertMessage {
  title: string;
  message: string;
  type: "success" | "error" | "warning";
}

export function useAvatarSettings() {
  const { data: session, update } = useSession();
  
  const [avatarAtual, setAvatarAtual] = useState<string>("/notPhoto.png");
  const [avatarSelecionado, setAvatarSelecionado] = useState<string>("");
  const [salvandoAvatar, setSalvandoAvatar] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<AlertMessage | null>(null);

  // ← CORRIGIR: Sincronizar com a sessão sempre que mudar
  useEffect(() => {
    if (session?.user?.avatar) {
      setAvatarAtual(session.user.avatar);
      
      // ← CORRIGIR: Só atualizar selecionado se não há um avatar sendo selecionado
      if (!avatarSelecionado || avatarSelecionado === avatarAtual) {
        setAvatarSelecionado(session.user.avatar);
      }
    }
  }, [session?.user?.avatar, avatarSelecionado, avatarAtual]); // ← CORRIGIR: Dependência específica

  // ← FUNÇÃO PARA SELECIONAR AVATAR
  const handleAvatarSelect = (avatar: string) => {
    setAvatarSelecionado(avatar);
  };

  // ← FUNÇÃO PARA ATUALIZAR AVATAR
  const handleAtualizarAvatar = async () => {
    if (!avatarSelecionado) {
      setAlertMessage({
        title: "Erro",
        message: "Selecione um avatar primeiro!",
        type: "error"
      });
      return;
    }

    if (avatarSelecionado === avatarAtual) {
      setAlertMessage({
        title: "Aviso",
        message: "Este já é seu avatar atual!",
        type: "warning"
      });
      return;
    }

    setSalvandoAvatar(true);

    try {
      
      const response = await settingsService.updateAvatar(
        { avatarUrl: avatarSelecionado },
        session?.accessToken || ""
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao atualizar avatar");
      }

      // ← CORRIGIR: Atualizar estado local primeiro
      const novoAvatar = avatarSelecionado;
      setAvatarAtual(novoAvatar);
      
      // ← CORRIGIR: Atualizar sessão e aguardar
      await update({
        ...session,
        user: {
          ...session?.user,
          avatar: novoAvatar,
        },
      });

      // ← CORRIGIR: Não limpar selecionado imediatamente
      // setAvatarSelecionado será atualizado pelo useEffect

      setAlertMessage({
        title: "Sucesso!",
        message: "Avatar atualizado com sucesso!",
        type: "success"
      });

    } catch (error) {
      console.error("❌ Erro ao atualizar avatar:", error);
      setAlertMessage({
        title: "Erro",
        message: error instanceof Error ? error.message : "Erro ao atualizar avatar. Tente novamente.",
        type: "error"
      });
    } finally {
      setSalvandoAvatar(false);
    }
  };

  const closeAlert = () => {
    setAlertMessage(null);
  };

  // ← CORRIGIR: Lógica mais robusta
  const avatarMudou = avatarSelecionado !== "" && avatarSelecionado !== avatarAtual;

  const resetSelection = () => {
    setAvatarSelecionado(avatarAtual);
  };

  return {
    avatarAtual,
    avatarSelecionado,
    salvandoAvatar,
    avatarMudou,
    alertMessage,
    handleAvatarSelect,
    handleAtualizarAvatar,
    closeAlert,
    resetSelection,
    setAvatarSelecionado,
  };
}

