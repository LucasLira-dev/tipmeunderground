import { GoKey } from "react-icons/go";
import { FaRegUser, FaMapMarkerAlt } from "react-icons/fa";
import { MdPayment } from "react-icons/md";



import { useState } from 'react';

interface SettingsFormData {
  pixKey: string;
  pixKeyType: string;
  pixName: string;
  pixCity: string;
}

interface PaymentSettingsFormProps {
  pixKey: string;
  pixKeyType: string;
  pixName: string;
  pixCity: string;
  onUpdateField: (field: keyof SettingsFormData, value: string | number) => void;
  errors?: {
    pixKey?: string;
    pixKeyType?: string;
    pixName?: string;
    pixCity?: string;
  };
}

export function PaymentSettingsForm({
  pixKey,
  pixKeyType = "",
  pixName,
  pixCity,
  onUpdateField,
  errors = {},
}: PaymentSettingsFormProps) {
  
  // ← ESTADO LOCAL PARA DISPLAY FORMATADO
  const [displayValues, setDisplayValues] = useState<{
    pixKey: string;
  }>({
    pixKey: "",
  });

  const pixTypes = [
    { value: "", label: "Selecione o tipo de chave" },
    { value: "cpf", label: "CPF" },
    { value: "cnpj", label: "CNPJ" },
    { value: "celular", label: "Celular" },
    { value: "email", label: "E-mail" },
    { value: "aleatoria", label: "Chave Aleatória" },
  ];

  const getPixPlaceholder = (type: string) => {
    switch (type) {
      case "cpf": return "000.000.000-00";
      case "cnpj": return "00.000.000/0000-00";
      case "celular": return "(11) 99999-9999";
      case "email": return "seuemail@exemplo.com";
      case "aleatoria": return "00000000-0000-0000-0000-000000000000";
      default: return "Selecione o tipo primeiro";
    }
  };

  // ← FORMATAÇÃO APENAS PARA DISPLAY
  const formatForDisplay = (value: string, type: string): string => {
    const stringValue = String(value);
    
    switch (type) {
      case "cpf":
        return stringValue
          .replace(/\D/g, '')
          .replace(/(\d{3})(\d)/, '$1.$2')
          .replace(/(\d{3})(\d)/, '$1.$2')
          .replace(/(\d{3})(\d{1,2})/, '$1-$2')
          .replace(/(-\d{2})\d+?$/, '$1');
      
      case "cnpj":
        return stringValue
          .replace(/\D/g, '')
          .replace(/(\d{2})(\d)/, '$1.$2')
          .replace(/(\d{3})(\d)/, '$1.$2')
          .replace(/(\d{3})(\d)/, '$1/$2')
          .replace(/(\d{4})(\d{1,2})/, '$1-$2')
          .replace(/(-\d{2})\d+?$/, '$1');
      
      case "celular":
        // ← FORMATAR PARA DISPLAY COM +55
        let phoneValue = stringValue.replace(/\D/g, '');
        
        // Se não começar com 55, adicionar
        if (!phoneValue.startsWith('55') && phoneValue.length >= 10) {
          phoneValue = '55' + phoneValue;
        }
        
        // Formatar: +55 (11) 99999-9999
        return phoneValue
          .replace(/^(\d{2})(\d{2})(\d)/, '+$1 ($2) $3')
          .replace(/(\d{5})(\d{1,4})/, '$1-$2')
          .replace(/(-\d{4})\d+?$/, '$1');
      
      default:
        return stringValue;
    }
  };

  // ← EXTRAIR VALOR PARA BACKEND (COM + PARA CELULAR)
  const getBackendValue = (formattedValue: string, type: string): string => {
    switch (type) {
      case "cpf":
      case "cnpj":
        return formattedValue.replace(/\D/g, ''); // Remove toda formatação: 12345678901
      
      case "celular":
        let phoneValue = formattedValue.replace(/\D/g, '');
        
        // Se não começar com 55, adicionar
        if (!phoneValue.startsWith('55') && phoneValue.length >= 10) {
          phoneValue = '55' + phoneValue;
        }
        
        return '+' + phoneValue; // ← RETORNA COM + : +5511999887766
      
      case "email":
      case "aleatoria":
        return formattedValue.trim(); // Mantém como está
      
      default:
        return formattedValue;
    }
  };

  const handlePixKeyChange = (inputValue: string | number) => {
    const stringValue = String(inputValue);
    
    // 1. Formatar para display
    const formattedValue = formatForDisplay(stringValue, pixKeyType);
    
    // 2. Extrair valor para backend
    const backendValue = getBackendValue(formattedValue, pixKeyType);
    
    // 3. Atualizar display local
    setDisplayValues(prev => ({
      ...prev,
      pixKey: formattedValue,
    }));
    
    // 4. Enviar valor para o backend
    onUpdateField("pixKey", backendValue);
  };

  const handleTypeChange = (type: string) => {
    onUpdateField("pixKeyType", type);
    onUpdateField("pixKey", ""); // Limpar chave
    setDisplayValues(prev => ({ ...prev, pixKey: "" })); // Limpar display
  };

  // ← VALOR PARA MOSTRAR NO INPUT
  const getDisplayValue = () => {
    if (displayValues.pixKey) {
      return displayValues.pixKey; // Mostrar valor formatado
    }
    
    // Se não tem display formatado, formatar o valor do backend
    if (pixKey && pixKeyType) {
      // Se for celular e vier com +, remover para reformatar
      const cleanKey = pixKeyType === "celular" ? pixKey.replace(/^\+/, '') : pixKey;
      return formatForDisplay(cleanKey, pixKeyType);
    }
    
    return "";
  };

  return (
    <article className="border border-[var(--soft-presence)] bg-[var(--bg-secondary)] p-6 rounded-xl">
      <h2 className="text-[var(--bright-azure)] text-xl font-semibold mb-4 flex items-center gap-1">
        <MdPayment className="inline-block mr-2" />
        Configurações de Pagamento
      </h2>
      <p className="text-[var(--soft-cyan)] text-sm mb-6">
        Configure como receber apoios e doações
      </p>
      
      <div className="grid gap-4 md:grid-cols-2">
        
        {/* ← TIPO DE CHAVE PIX */}
        <div className="md:col-span-2">
          <label className="text-[var(--soft-cyan)] text-sm font-semibold block mb-2">
            <GoKey className="inline-block mr-2" />
            Tipo de Chave PIX
          </label>
          <select
            value={pixKeyType}
            onChange={(e) => handleTypeChange(e.target.value)}
            className={`w-full p-3 bg-black/50 border rounded-md focus:outline-none text-sky-100 ${
              errors.pixKeyType
                ? 'border-red-500 focus:border-red-400'
                : 'border-sky-400/30 focus:border-sky-300'
            }`}
          >
            {pixTypes.map((type) => (
              <option key={type.value} value={type.value} className="bg-gray-800">
                {type.label}
              </option>
            ))}
          </select>
          {errors.pixKeyType && (
            <p className="text-red-400 text-xs mt-1">❌ {errors.pixKeyType}</p>
          )}
        </div>

        {/* ← INPUT DA CHAVE PIX */}
        {pixKeyType && (
          <div className="md:col-span-2">
            <label className="text-[var(--soft-cyan)] text-sm font-semibold block mb-2">
              Chave PIX ({pixTypes.find(t => t.value === pixKeyType)?.label})
            </label>
            <input
              type={pixKeyType === "email" ? "email" : "text"}
              value={getDisplayValue()}
              onChange={(e) => handlePixKeyChange(e.target.value)}
              className={`w-full p-3 bg-black/50 border rounded-md focus:outline-none text-sky-100 ${
                errors.pixKey
                  ? 'border-red-500 focus:border-red-400'
                  : 'border-sky-400/30 focus:border-sky-300'
              }`}
              placeholder={getPixPlaceholder(pixKeyType)}
              disabled={!pixKeyType}
            />
            {errors.pixKey && (
              <p className="text-red-400 text-xs mt-1">❌ {errors.pixKey}</p>
            )}
            
            {/* ← DICA DO TIPO DE CHAVE */}
            <p className="text-sky-400/70 text-xs mt-1">
              {pixKeyType === "cpf" && "Digite apenas números, a formatação será automática"}
              {pixKeyType === "cnpj" && "Digite apenas números, a formatação será automática"}
              {pixKeyType === "celular" && "Digite DDD + número, o +55 será adicionado automaticamente"}
              {pixKeyType === "email" && "Digite um e-mail válido cadastrado no seu banco"}
              {pixKeyType === "aleatoria" && "Cole a chave aleatória gerada pelo seu banco"}
            </p>
          </div>
        )}

        {/* ← NOME COMPLETO */}
        <div>
          <label className="text-[var(--soft-cyan)] text-sm font-semibold block mb-2">
            <FaRegUser className="inline-block mr-2" />
            Nome Completo
          </label>
          <input
            type="text"
            value={pixName}
            onChange={(e) => onUpdateField("pixName", e.target.value)}
            className={`w-full p-3 bg-black/50 border rounded-md focus:outline-none text-sky-100 ${
              errors.pixName
                ? 'border-red-500 focus:border-red-400'
                : 'border-sky-400/30 focus:border-sky-300'
            }`}
            placeholder="Nome que aparece no PIX"
          />
          {errors.pixName && (
            <p className="text-red-400 text-xs mt-1">❌ {errors.pixName}</p>
          )}
        </div>

        {/* ← CIDADE */}
        <div>
          <label className="text-[var(--soft-cyan)] text-sm font-semibold block mb-2">
            <FaMapMarkerAlt className="inline-block mr-2" />
            Cidade
          </label>
          <input
            type="text"
            value={pixCity}
            onChange={(e) => onUpdateField("pixCity", e.target.value)}
            className={`w-full p-3 bg-black/50 border rounded-md focus:outline-none text-sky-100 ${
              errors.pixCity
                ? 'border-red-500 focus:border-red-400'
                : 'border-sky-400/30 focus:border-sky-300'
            }`}
            placeholder="Sua cidade"
          />
          {errors.pixCity && (
            <p className="text-red-400 text-xs mt-1">❌ {errors.pixCity}</p>
          )}
        </div>

        {/* ← PREVIEW DA CHAVE (MOSTRAR AMBOS OS FORMATOS) */}
        {pixKey && pixKeyType && (
          <div className="md:col-span-2 p-4 bg-sky-400/10 border border-sky-400/20 rounded-lg">
            <h4 className="text-sky-300 font-semibold mb-2">📋 Preview da Chave PIX:</h4>
            
            {/* Formato visual */}
            <div className="font-mono text-sky-100 bg-black/30 p-2 rounded text-sm break-all mb-2">
              <strong>Exibição:</strong> {getDisplayValue()}
            </div>
            
            
            <p className="text-sky-400 text-xs mt-2">
              Esta chave será usada para que você receba pagamentos via PIX.
            </p>
          </div>
        )}
      </div>
    </article>
  );
}
