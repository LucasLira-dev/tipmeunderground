// 'use client'

// import { useState } from 'react';
// import { profileService } from "@/services/profileServices";

// interface PixDonationFormProps {
//   userId: string;
// }

// export function PixDonationForm({ userId }: PixDonationFormProps) {
//   const [valor, setValor] = useState<number>(0);
//   const [chavePix, setChavePix] = useState<string | null>(null);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string | null>(null);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (valor <= 0) {
//       setError('Digite um valor válido');
//       return;
//     }

//     if (!userId) {
//       setError('Usuário não encontrado');
//       return;
//     }

//     setLoading(true);
//     setError(null);
//     setChavePix(null);
    
//     try {
//       console.log('🔄 Buscando PIX para:', { userId, valor });
      
//       const response = await profileService.getPix({ userId, value: valor });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || 'Erro ao buscar PIX');
//       }

//       const data = await response.json();
//       const pixKey = data.payload;

//       setChavePix(pixKey);
//       console.log('✅ Chave PIX recebida:', pixKey);
      
//     } catch (error) {
//       console.error('❌ Erro ao buscar PIX:', error);
//       setError(error instanceof Error ? error.message : 'Erro ao buscar PIX');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCopyPix = async () => {
//     if (!chavePix) return;
    
//     try {
//       await navigator.clipboard.writeText(chavePix);
//       // Você pode adicionar um toast/feedback aqui
//       console.log('📋 PIX copiado para a área de transferência');
//     } catch (error) {
//       console.error('❌ Erro ao copiar PIX:', error);
//     }
//   };

//   const handleClearPix = () => {
//     setChavePix(null);
//     setValor(0);
//     setError(null);
//   };

//   return (
//     <div className="bg-gray-800 p-6 rounded-lg">
//       <h2 className="text-white text-lg mb-4 font-semibold">💰 Quer fazer uma doação?</h2>

//       <form className="space-y-4" onSubmit={handleSubmit}>
//         <div>
//           <label className="block text-white text-sm font-medium mb-2">
//             Valor (R$)
//           </label>
//           <input
//             type="number"
//             value={valor}
//             placeholder="Digite o valor"
//             min="1"
//             step="0.01"
//             required
//             disabled={loading}
//             className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
//             onChange={(e) => setValor(Number(e.target.value))}
//           />
//         </div>

//         {/* ← MOSTRAR ERRO SE HOUVER */}
//         {error && (
//           <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-md">
//             <p className="text-red-400 text-sm">❌ {error}</p>
//           </div>
//         )}
        
//         <button
//           type="submit"
//           disabled={loading || valor <= 0 || !userId}
//           className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-md transition-colors"
//         >
//           {loading ? '🔄 Buscando...' : '💳 Fazer Doação'}
//         </button>
//       </form>

//       {/* ← MOSTRAR CHAVE PIX QUANDO RECEBIDA */}
//       {chavePix && (
//         <div className="mt-6 p-4 bg-green-800/30 border border-green-500/30 rounded-lg">
//           <h3 className="text-green-400 font-semibold mb-2">✅ Chave PIX encontrada:</h3>
//           <div className="bg-gray-900 p-3 rounded-md">
//             <p className="text-white font-mono text-sm break-all">{chavePix}</p>
//           </div>
//           <div className="mt-3 flex gap-2">
//             <button
//               onClick={handleCopyPix}
//               className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors"
//             >
//               📋 Copiar
//             </button>
//             <button
//               onClick={handleClearPix}
//               className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm transition-colors"
//             >
//               🗑️ Limpar
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }  
'use client'

import { useState } from 'react';
import { profileService } from "@/services/profileServices";
import { X, Copy, QrCode } from 'lucide-react';

interface PixDonationFormProps {
  userId: string;
  userName?: string | null; // opcional, caso queira exibir o nome do usuário
}

export function PixDonationForm({ userId, userName }: PixDonationFormProps) {
  const [valor, setValor] = useState<number>(0);
  const [chavePix, setChavePix] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (valor <= 0) {
      setError('Digite um valor válido');
      return;
    }

    if (!userId) {
      setError('Usuário não encontrado');
      return;
    }

    setLoading(true);
    setError(null);
    setChavePix(null);
    
    try {
      console.log('🔄 Buscando PIX para:', { userId, valor });
      
      const response = await profileService.getPix({ userId, value: valor });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao buscar PIX');
      }

      const data = await response.json();
      const pixKey = data.payload;

      setChavePix(pixKey);
      setShowModal(true);
      console.log('✅ Chave PIX recebida:', pixKey);
      
    } catch (error) {
      console.error('❌ Erro ao buscar PIX:', error);
      setError(error instanceof Error ? error.message : 'Erro ao buscar PIX');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyPix = async () => {
    if (!chavePix) return;
    
    try {
      await navigator.clipboard.writeText(chavePix);
      setCopied(true);
      console.log('📋 PIX copiado para a área de transferência');
      
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('❌ Erro ao copiar PIX:', error);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setChavePix(null);
    setValor(0);
    setError(null);
    setCopied(false);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <>
      {/* ← BOTÃO PARA ABRIR MODAL (substituindo o formulário antigo) */}
      <div className="text-center mt-4">
        <button
          onClick={() => setShowModal(true)}
          className="bg-sky-400 hover:bg-sky-300 text-black font-medium py-3 px-6 rounded-lg transition-colors cursor-pointer"
        >
          💰 Doar
        </button>
      </div>

      {/* ← MODAL COM SEU ESTILO COMPLETO */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-gradient-to-br from-black/90 via-sky-900/80 to-black/90 backdrop-blur-sm"
            onClick={handleCloseModal}
          />

          {/* Modal */}
          <div className="relative w-full max-w-md bg-black/95 border border-sky-300/20 rounded-2xl shadow-2xl backdrop-blur-xl">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-sky-300/20">
              <h3 className="text-xl font-semibold text-sky-300">💳 Doar via PIX</h3>
              <button
                onClick={handleCloseModal}
                className="text-sky-400 hover:text-sky-300 hover:bg-sky-400/10 p-2 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              
              {/* ← FORMULÁRIO DE VALOR DENTRO DO MODAL */}
              {!chavePix && (
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div>
                    <label className="block text-sky-200 text-sm font-medium mb-2">
                      Valor da doação (R$)
                    </label>
                    <input
                      type="number"
                      value={valor || ''}
                      placeholder="Digite o valor"
                      min="1"
                      step="0.01"
                      required
                      disabled={loading}
                      className="w-full p-3 bg-black/50 border border-sky-400/30 rounded-md text-sky-100 placeholder-sky-400/50 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400 disabled:opacity-50"
                      onChange={(e) => setValor(Number(e.target.value))}
                    />
                  </div>

                  {/* ← ERRO */}
                  {error && (
                    <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-md">
                      <p className="text-red-400 text-sm">❌ {error}</p>
                    </div>
                  )}
                  
                  <button
                    type="submit"
                    disabled={loading || valor <= 0}
                    className={`w-full font-medium py-3 px-4 rounded-md transition-colors ${
                      loading || valor <= 0
                        ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        : 'bg-sky-400 hover:bg-sky-300 text-black'
                    }`}
                  >
                    {loading ? '🔄 Buscando PIX...' : 'Gerar PIX'}
                  </button>
                </form>
              )}

              {/* ← MOSTRAR PIX QUANDO CARREGADO */}
              {chavePix && (
                <>
                  {/* Valor da doação */}
                  <div className="text-center p-4 bg-sky-400/10 rounded-xl border border-sky-400/20 ">
                    <p className="text-sky-200 text-sm mb-1">Valor da doação para</p>
                    <p className="text-sky-300 font-semibold text-lg"> {userName} </p>
                    <p className="text-3xl font-bold text-sky-400">{formatCurrency(valor)}</p>
                  </div>

                  {/* Chave PIX */}
                  <div className="space-y-3">
                    <label className="text-sky-200 font-semibold flex items-center gap-2">
                      <QrCode className="w-5 h-5 text-sky-400" />
                      Chave PIX
                    </label>
                    <div className="flex gap-3">
                      <input 
                        value={chavePix} 
                        readOnly 
                        className="bg-black/50 border border-sky-400/30 text-sky-100 flex-1 p-3 rounded-md font-mono text-sm"
                      />
                      <button 
                        onClick={handleCopyPix} 
                        className="bg-sky-400 hover:bg-sky-300 text-black px-6 py-3 rounded-md transition-colors flex items-center gap-2"
                      >
                         <Copy className="w-4 h-4" />
                        <span className="hidden xs:inline sm:inline">
                          {copied ? "Copiado! ✨" : "Copiar"}
                        </span>
                        <span className="xs:hidden sm:hidden">
                          {copied ? "✨" : "📋"}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Instruções */}
                  <div className="bg-sky-400/5 border border-sky-400/20 rounded-xl p-4">
                    <h4 className="text-sky-300 font-semibold mb-2 flex items-center gap-2">📱 Como doar:</h4>
                    <ol className="text-sky-400 text-sm space-y-1">
                      <li>1. Copie a chave PIX </li>
                      <li>2. Abra seu app bancário</li>
                      <li>3. Faça um PIX com o valor de {formatCurrency(valor)}</li>
                      <li>4. Cole a chave PIX copiada</li>
                      <li>5. Confirme a transferência</li>
                    </ol>
                  </div>
                </>
              )}

              {/* Botão de fechar */}
              <button 
                onClick={handleCloseModal} 
                className="w-full bg-sky-400 hover:bg-sky-300 text-black py-3 rounded-md font-medium transition-colors"
              >
                {chavePix ? "Entendi! 💙" : "Cancelar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}




//00020126460014BR.GOV.BCB.PIX0111499884504410209Pay me :)520400005303986540520.005802BR5905MAGOZ6009SAO PAULO61089999999962230519YOUR_TRANSACTION_ID6304E6CB