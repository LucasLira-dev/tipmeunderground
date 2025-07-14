import { FaRegEyeSlash, FaCheck } from "react-icons/fa";
import { MdOutlineRemoveRedEye, MdLock } from "react-icons/md";
import { CiSettings } from "react-icons/ci";
import { HiOutlineMail } from "react-icons/hi";
import { IoMdUnlock } from "react-icons/io";


interface SettingsFormData {
  email: string;
  senhaAtual: string;
  senhaNova: string;
  confirmarSenha: string;
}

interface AccountSettingsFormProps {
  email: string;
  senhaAtual: string;
  senhaNova: string;
  confirmarSenha: string;
  passwordVisible: boolean;
  onUpdateField: (field: keyof SettingsFormData, value: string) => void;
  onTogglePasswordVisibility: () => void;
}

export function AccountSettingsForm({
  email,
  senhaAtual,
  senhaNova,
  confirmarSenha,
  passwordVisible,
  onUpdateField,
  onTogglePasswordVisibility,
}: AccountSettingsFormProps) {
  return (
    <article className="border border-[var(--soft-presence)] bg-[var(--bg-secondary)] p-6 rounded-xl">
      <h2 className="text-[var(--bright-azure)] text-xl font-semibold mb-4 flex items-center gap-1">
        <CiSettings className="inline-block mr-2" />
        Configurações da Conta
      </h2>
      <p className="text-[var(--soft-cyan)] text-sm mb-4">
        Altere email e senha
      </p>
      
      <div className="grid gap-4">
        <div>
          <label className="text-[var(--soft-cyan)] text-sm font-semibold">
            <HiOutlineMail className="inline-block mr-2" />
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => onUpdateField("email", e.target.value)}
            className="w-full p-3 bg-black/50 border border-sky-400/30 focus:border-sky-300 rounded-md focus:outline-none text-sky-100 mt-1"
            placeholder="Digite seu email"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="text-[var(--soft-cyan)] text-sm font-semibold">
              <MdLock className="inline-block mr-2" />
              Senha Atual
            </label>
            <div className="relative">
              <input
                type={passwordVisible ? "text" : "password"}
                value={senhaAtual}
                onChange={(e) => onUpdateField("senhaAtual", e.target.value)}
                className="w-full p-3 bg-black/50 border border-sky-400/30 focus:border-sky-300 rounded-md focus:outline-none text-sky-100 mt-1"
                placeholder="Digite sua senha atual"
              />
              <span
                onClick={onTogglePasswordVisibility}
                className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
              >
                {passwordVisible ? (
                  <FaRegEyeSlash className="text-sky-400" />
                ) : (
                  <MdOutlineRemoveRedEye className="text-sky-400" />
                )}
              </span>
            </div>
          </div>

          <div>
            <label className="text-[var(--soft-cyan)] text-sm font-semibold">
              <IoMdUnlock className="inline-block mr-2" />
              Nova Senha
            </label>
            <input
              type={passwordVisible ? "text" : "password"}
              value={senhaNova}
              onChange={(e) => onUpdateField("senhaNova", e.target.value)}
              className="w-full p-3 bg-black/50 border border-sky-400/30 focus:border-sky-300 rounded-md focus:outline-none text-sky-100 mt-1"
              placeholder="Digite sua nova senha"
            />
          </div>

          <div>
            <label className="text-[var(--soft-cyan)] text-sm font-semibold">
              <FaCheck className="inline-block mr-2" />
              Confirmar Nova Senha
            </label>
            <input
              type={passwordVisible ? "text" : "password"}
              value={confirmarSenha}
              onChange={(e) => onUpdateField("confirmarSenha", e.target.value)}
              className="w-full p-3 bg-black/50 border border-sky-400/30 focus:border-sky-300 rounded-md focus:outline-none text-sky-100 mt-1"
              placeholder="Confirme sua nova senha"
            />
          </div>
        </div>
      </div>
    </article>
  );
}