
// src/components/Settings/AvatarSection.tsx
import Image from "next/image";
import { BiCheck } from "react-icons/bi";
import { FaCamera } from "react-icons/fa";

interface AvatarSectionProps {
  avatarAtual: string;
  avatarSelecionado: string;
  salvandoAvatar: boolean;
  avatarMudou: boolean;
  avatars: string[];
  onAvatarSelect: (avatar: string) => void;
  onUpdateAvatar: () => void;
}

export function AvatarSection({
  avatarAtual,
  avatarSelecionado,
  salvandoAvatar,
  avatarMudou,
  avatars,
  onAvatarSelect,
  onUpdateAvatar,
}: AvatarSectionProps) {
  
  // ← CORRIGIR: Calcular se avatar mudou localmente
  const avatarEfetivamenteMudou = avatarSelecionado && avatarSelecionado !== avatarAtual;

  const avatarParaMostrar = avatarSelecionado || avatarAtual;
  
  console.log("🔍 Debug Avatar:", {
    avatarAtual,
    avatarSelecionado,
    avatarMudou,
    avatarEfetivamenteMudou
  });

  return (
    <article className="border border-[var(--soft-presence)] bg-[var(--bg-secondary)] p-6 rounded-xl">
      <h2 className="text-[var(--bright-azure)] text-xl font-semibold mb-4 flex items-center gap-1">
        <FaCamera className="inline-block mr-2" />
        Avatar
      </h2>
      
      <div className="flex flex-col items-center gap-4">
        {/* ← CORRIGIR: Mostrar avatar atual sempre, selecionado apenas visualmente */}
        <div className="relative w-24 h-24">
          <Image
            width={96}
            height={96}
            src={avatarParaMostrar}
            alt={avatarEfetivamenteMudou ? "Novo Avatar Selecionado" : "Avatar Atual"}
            className=" rounded-full border-2 border-[var(--bright-azure)] object-cover"
            onError={() => {
              console.error("❌ Erro ao carregar avatar:", avatarAtual);
            }}
          />
          
          {/* ← INDICADOR SE AVATAR MUDOU */}
          {avatarEfetivamenteMudou && (
            <div className="absolute -top-2 -right-2 bg-yellow-500 text-black text-xs px-2 py-1 rounded-full">
              Novo
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-4 gap-2">
          {avatars.map((avatar, index) => (
            <div key={index} className="relative w-16 h-16">
              <Image
                width={64}
                height={64}
                src={avatar}
                alt={`Avatar ${index + 1}`}
                className={`rounded-full cursor-pointer border-2 transition-all object-cover ${
                  avatarSelecionado === avatar
                    ? "border-[var(--bright-azure)] scale-110"
                    : avatarAtual === avatar
                    ? "border-green-500 scale-105" // ← INDICAR AVATAR ATUAL
                    : "border-transparent hover:border-[var(--soft-cyan)]"
                }`}
                onClick={() => onAvatarSelect(avatar)}
                onError={() => {
                  console.error("❌ Erro ao carregar avatar da galeria:", avatar);
                }}
              />
              
              {/* ← INDICADORES VISUAIS */}
              {avatarSelecionado === avatar && avatarAtual !== avatar && (
                <div className="absolute inset-0 bg-sky-400/20 flex items-center justify-center rounded-full">
                  <BiCheck className="w-6 h-6 text-sky-400" />
                </div>
              )}
              
              {avatarAtual === avatar && (
                <div className="absolute -top-1 -right-1 bg-green-500 text-white text-xs px-1 rounded-full">
                  ✓
                </div>
              )}
            </div>
          ))}
        </div>
        
        {/* ← CORRIGIR: Lógica do botão */}
        <div className="flex flex-col items-center gap-2">
          <button
            onClick={onUpdateAvatar}
            disabled={!avatarEfetivamenteMudou || salvandoAvatar}
            className={`font-semibold py-2 px-4 rounded-lg transition-colors ${
              avatarEfetivamenteMudou && !salvandoAvatar
                ? "bg-[var(--bright-azure)] hover:bg-[var(--soft-cyan)] text-black"
                : "bg-gray-600 text-gray-400 cursor-not-allowed"
            }`}
          >
            {salvandoAvatar ? "Salvando..." : "Atualizar Avatar"}
          </button>
          
          {/* ← MENSAGEM DE STATUS */}
          {!avatarEfetivamenteMudou && avatarSelecionado === avatarAtual && (
            <p className="text-green-400 text-sm">✓ Este já é seu avatar atual</p>
          )}
          
          {avatarEfetivamenteMudou && (
            <p className="text-yellow-400 text-sm">⚠️ Clique para aplicar o novo avatar</p>
          )}
        </div>
      </div>
    </article>
  );
}