import { FaRegUser, FaMicrophone, FaFileAlt } from "react-icons/fa";


interface SettingsFormData {
  nomeArtistico: string;
  userName: string;
  bio: string;
}

interface ProfileInfoFormProps {
  nomeArtistico: string;
  userName: string;
  bio: string;
  onUpdateField: (field: keyof SettingsFormData, value: string) => void;
}

export function ProfileInfoForm({
  nomeArtistico,
  userName,
  bio,
  onUpdateField,
}: ProfileInfoFormProps) {
  return (
    <article className="border border-[var(--soft-presence)] bg-[var(--bg-secondary)] p-6 rounded-xl">
      <h2 className="text-[var(--bright-azure)] text-xl font-semibold mb-4 flex items-center gap-1">
        <FaRegUser className="inline-block mr-2" />
        Informações do Perfil
      </h2>
      <p className="text-[var(--soft-cyan)] text-sm mb-4">
        Dados que aparecerão no seu perfil público
      </p>
      
      <div className="grid gap-4">
        <div
        className="md:grid md:grid-cols-2 gap-4">
          <div
          className="mb-4 md:mb-0">
            <label className="text-[var(--soft-cyan)] text-sm font-semibold flex items-center">
              <FaMicrophone className="inline-block mr-2" />
              Nome Artístico
            </label>
            <input
              type="text"
              value={nomeArtistico}
              onChange={(e) => onUpdateField("nomeArtistico", e.target.value)}
              className="w-full p-3 bg-black/50 border border-sky-400/30 focus:border-sky-300 rounded-md focus:outline-none text-sky-100 mt-1"
              placeholder="Digite seu nome artístico"
            />
          </div>

          <div>
            <label className="text-[var(--soft-cyan)] text-sm font-semibold flex items-center">
              <FaRegUser className="inline-block mr-2" />
              Nome de Usuário
            </label>
            <input
              type="text"
              value={userName}
              onChange={(e) => onUpdateField("userName", e.target.value)}
              className="w-full p-3 bg-black/50 border border-sky-400/30 focus:border-sky-300 rounded-md focus:outline-none text-sky-100 mt-1"
              placeholder="Digite seu nome de usuário"
            />
          </div>
        </div>

        <div>
          <label className="text-[var(--soft-cyan)] text-sm font-semibold flex items-center">
            <FaFileAlt
             className="inline-block mr-2" />
            Bio
          </label>
          <textarea
            value={bio}
            onChange={(e) => onUpdateField("bio", e.target.value)}
            className="w-full p-3 bg-black/50 border border-sky-400/30 focus:border-sky-300 rounded-md focus:outline-none text-sky-100 mt-1 resize-none"
            placeholder="Conte um pouco sobre você..."
            rows={3}
            maxLength={300}
          />
          <p className="text-[var(--cyan-glow)] text-xs mt-1">
            Máximo 300 caracteres
          </p>
        </div>
      </div>
    </article>
  );
}