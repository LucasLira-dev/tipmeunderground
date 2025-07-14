import { FiLink } from "react-icons/fi";
import { FaInstagram, FaYoutube, FaSpotify } from "react-icons/fa";

// Define SettingsFormData type if not already imported
type SettingsFormData = {
  instagram: string;
  spotify: string;
  youtube: string;
  // soundcloud?: string;
};

interface SocialLinksFormProps {
  instagram: string;
  spotify: string;
  youtube: string;
  // soundcloud?: string;
  onUpdateField: (field: keyof SettingsFormData, value: string) => void;
}

export function SocialLinksForm({
  instagram,
  spotify,
  youtube,
  // soundcloud,
  onUpdateField,
}: SocialLinksFormProps) {
  return (
    <article className="border border-[var(--soft-presence)] bg-[var(--bg-secondary)] p-6 rounded-xl">
      <h2 className="text-[var(--bright-azure)] text-xl font-semibold mb-4 flex items-center gap-1">
        <FiLink className="inline-block mr-2" />
        Redes Sociais
      </h2>
      <p className="text-[var(--soft-cyan)] text-sm mb-4">
        Conecte suas redes sociais e portfólios
      </p>
      
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="text-[var(--soft-cyan)] text-sm font-semibold flex items-center">
            <FaInstagram className="inline-block mr-2" />
            Instagram
          </label>
          <input
            type="url"
            value={instagram}
            onChange={(e) => onUpdateField("instagram", e.target.value)}
            className="w-full p-3 bg-black/50 border border-sky-400/30 focus:border-sky-300 rounded-md focus:outline-none text-sky-100 mt-1"
            placeholder="https://instagram.com/seu_usuario"
          />
        </div>

        <div>
          <label className="text-[var(--soft-cyan)] text-sm font-semibold flex items-center">
            <FaSpotify className="inline-block mr-2" />
            Spotify
          </label>
          <input
            type="url"
            value={spotify}
            onChange={(e) => onUpdateField("spotify", e.target.value)}
            className="w-full p-3 bg-black/50 border border-sky-400/30 focus:border-sky-300 rounded-md focus:outline-none text-sky-100 mt-1"
            placeholder="https://open.spotify.com/artist/seu_id"
          />
        </div>

        <div>
          <label className="text-[var(--soft-cyan)] text-sm font-semibold flex items-center">
            <FaYoutube className="inline-block mr-2" />
            YouTube
          </label>
          <input
            type="url"
            value={youtube}
            onChange={(e) => onUpdateField("youtube", e.target.value)}
            className="w-full p-3 bg-black/50 border border-sky-400/30 focus:border-sky-300 rounded-md focus:outline-none text-sky-100 mt-1"
            placeholder="https://youtube.com/@seu_usuario"
          />
        </div>
      </div>
    </article>
  );
}