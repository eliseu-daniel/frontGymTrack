import React, { useState } from "react";
import { api } from "../services/api";
import {
  Smartphone,
  Download,
  ShieldCheck,
  ArrowRight,
  AlertCircle,
  CheckCircle,
  ChevronRight,
  Info
} from "lucide-react";

export default function DownloadPage() {
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleDownload = async () => {
    try {
      setDownloading(true);
      setError(null);
      setSuccess(false);
      setProgress(0);

      const response = await api.get("/download", {
        responseType: "blob",
        onDownloadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setProgress(percentCompleted);
          } else {
            setProgress((prev) => {
              if (prev >= 90) return prev;
              return prev + 10;
            });
          }
        },
      });

      setProgress(100);

      const blob = new Blob([response.data], {
        type: "application/vnd.android.package-archive",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "synchrofit.apk");
      document.body.appendChild(link);
      link.click();

      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);

      setSuccess(true);
    } catch (err) {
      setError(
        "Não foi possível baixar o aplicativo automaticamente. Você pode tentar o download alternativo."
      );
    } finally {
      setDownloading(false);
    }
  };

  const handleAlternativeDownload = () => {
    const apiBaseUrl = import.meta.env.VITE_API_URL;
    window.open(`${apiBaseUrl}/download`, "_blank");
  };

  const steps = [
    {
      num: "1",
      title: "Baixe o APK",
      desc: "Clique no botão acima para iniciar a transferência do arquivo para seu dispositivo.",
    },
    {
      num: "2",
      title: "Permita Fontes Desconhecidas",
      desc: "Se solicitado pelo sistema Android, vá em Configurações e autorize o navegador a instalar apps.",
    },
    {
      num: "3",
      title: "Abra e Instale",
      desc: "Abra a notificação do download finalizado ou procure pelo arquivo na pasta de downloads e toque em Instalar.",
    },
    {
      num: "4",
      title: "Entre e Comece!",
      desc: "Abra o aplicativo Synchro Fit instalado e faça login com as suas credenciais normais.",
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-50 text-sf-ink font-sans flex flex-col">
      {/* Cabeçalho de Branding Público */}
      <header className="bg-white border-b border-black/[0.06] py-4 px-6 md:px-12 flex justify-between items-center shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-16 h-16 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-sm">
            <img src="./src/assets/image.png" alt="Logo" width={100} height={100} />
          </div>
          <div>
            <span className="text-[10px] tracking-[0.2em] uppercase font-bold text-zinc-400 block leading-none">Synchro Fit</span>
            <span className="text-sm font-serif font-semibold text-sf-ink leading-tight">Plataforma</span>
          </div>
        </div>
        <a 
          href="/" 
          className="text-xs uppercase font-semibold text-zinc-650 hover:text-emerald-700 transition tracking-wider flex items-center gap-1.5"
        >
          Área Restrita <ArrowRight size={14} />
        </a>
      </header>

      {/* Conteúdo Principal */}
      <main className="flex-1 py-10 px-4 md:px-8 max-w-6xl w-full mx-auto flex flex-col justify-center">
        <h1 className="text-center font-serif text-3xl md:text-4xl uppercase tracking-wide mb-8 text-sf-ink">
          Baixar Aplicativo
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Lado Esquerdo: Visualização Premium do Smartphone Mockup */}
          <div className="lg:col-span-5 bg-sf-panel rounded-2xl p-8 flex flex-col justify-center items-center shadow-soft border border-black/[0.03]">
            <div className="relative w-64 h-[450px] bg-zinc-900 rounded-[3rem] border-8 border-zinc-800 shadow-2xl flex flex-col overflow-hidden">
              {/* Câmera/Notch do Celular */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-5 bg-zinc-800 rounded-full z-20 flex justify-center items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-zinc-950 rounded-full"></span>
                <span className="w-10 h-1 bg-zinc-950 rounded-full"></span>
              </div>

              {/* Tela Interna Simulada */}
              <div className="flex-1 bg-gradient-to-tr from-emerald-800 to-teal-900 p-6 flex flex-col justify-between items-center text-white relative">
                {/* Círculos de Fundo Decorativos */}
                <div className="absolute top-[-20%] left-[-20%] w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute bottom-[-20%] right-[-20%] w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none"></div>

                {/* Status Bar Simulada */}
                <div className="w-full flex justify-between items-center text-[10px] opacity-80 pt-1 font-sans">
                  <span>12:00</span>
                  <div className="flex items-center gap-1">
                    <span>5G</span>
                    <div className="w-4 h-2.5 border border-white/50 rounded-sm p-[1px] flex items-center">
                      <div className="w-full h-full bg-white rounded-2xs"></div>
                    </div>
                  </div>
                </div>

                {/* Conteúdo Central */}
                <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center mt-6">
                  <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20 shadow-lg backdrop-blur-md animate-pulse">
                    <Smartphone size={32} className="text-emerald-300" />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl tracking-wider uppercase font-semibold leading-tight">
                      Synchro Fit
                    </h3>
                  </div>
                </div>

                {/* Elemento de Interface Simulado (Card de Treino) */}
                <div className="w-full bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10 text-left font-sans shadow-md mb-2">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] uppercase tracking-wider text-emerald-300 font-semibold">Meu Treino</span>
                    <span className="text-[9px] bg-emerald-500 px-1.5 py-0.5 rounded text-white font-bold">HOJE</span>
                  </div>
                  <div className="text-xs font-bold leading-tight">Treino A - Hipertrofia</div>
                  <div className="text-[9px] text-white/70 mt-0.5">Peito, Tríceps e Ombros</div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-6 text-zinc-650 text-xs">
              <ShieldCheck size={16} className="text-emerald-600 shrink-0" />
              <span>Arquivo verificado e livre de vírus.</span>
            </div>
          </div>

          {/* Lado Direito: Ações de Download e Passo a Passo */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            
            {/* Card Principal de Download */}
            <div className="bg-sf-panel rounded-2xl p-6 shadow-soft border border-black/[0.03] flex flex-col gap-5">
              <div>
                <h2 className="text-xl font-serif text-sf-ink font-semibold flex items-center gap-2">
                  <Download size={22} className="text-sf-greenDark" />
                  Obter para Android (APK)
                </h2>
                <p className="text-sm text-zinc-650 mt-1 leading-relaxed">
                  Acompanhe suas dietas e treinos recomendadas e envie feedbacks em tempo real diretamente de seu celular com o aplicativo oficial da plataforma.
                </p>
              </div>

              {/* Status e Feedback de Ações */}
              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md flex items-start gap-3">
                  <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={18} />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-red-800">Falha ao baixar arquivo</p>
                    <p className="text-xs text-red-700 mt-0.5">{error}</p>
                    <button
                      onClick={handleAlternativeDownload}
                      className="mt-2 text-xs font-bold text-red-800 hover:underline flex items-center gap-1"
                    >
                      Tentar link alternativo <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              )}

              {success && (
                <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4 rounded-md flex items-start gap-3">
                  <CheckCircle className="text-emerald-500 shrink-0 mt-0.5" size={18} />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-emerald-800">Download iniciado!</p>
                    <p className="text-xs text-emerald-750 mt-0.5">
                      O arquivo APK foi transferido. Siga as instruções abaixo para realizar a instalação no seu aparelho.
                    </p>
                  </div>
                </div>
              )}

              {/* Botão e Barra de Progresso */}
              <div className="flex flex-col gap-3">
                <button
                  onClick={handleDownload}
                  disabled={downloading}
                  className={[
                    "w-full py-3.5 rounded-xl font-serif text-lg font-semibold tracking-wide shadow-soft transition-all duration-300",
                    "flex items-center justify-center gap-2",
                    downloading 
                      ? "bg-zinc-300 text-zinc-500 cursor-not-allowed" 
                      : success
                        ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                        : "bg-sf-greenDark hover:bg-emerald-600 text-white hover:shadow-md active:scale-[0.99]"
                  ].join(" ")}
                >
                  {downloading ? (
                    <>
                      <span className="w-5 h-5 border-2 border-zinc-500 border-t-transparent rounded-full animate-spin"></span>
                      <span>BAIXANDO ({progress}%) ...</span>
                    </>
                  ) : success ? (
                    <>
                      <CheckCircle size={20} />
                      <span>BAIXAR NOVAMENTE</span>
                    </>
                  ) : (
                    <>
                      <Download size={20} />
                      <span>BAIXAR APLICATIVO (APK)</span>
                    </>
                  )}
                </button>

                {/* Barra de Progresso Real */}
                {downloading && (
                  <div className="w-full bg-zinc-200 rounded-full h-2.5 overflow-hidden">
                    <div 
                      className="bg-emerald-500 h-full transition-all duration-300 rounded-full" 
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                )}
              </div>

              {/* Caixa Informativa */}
              <div className="bg-sky-50 rounded-xl p-3.5 border border-sky-100 flex gap-3 text-sky-850">
                <Info size={18} className="text-sky-600 shrink-0 mt-0.5" />
                <div className="text-xs leading-relaxed text-zinc-700">
                  <span className="font-semibold text-sky-900 block mb-0.5">Por que em formato APK?</span>
                  Os aplicativos fora da loja oficial Google Play Store são distribuídos no formato seguro <strong className="text-zinc-900 font-bold">APK</strong>. O app Synchro Fit é assinado digitalmente, garantindo total segurança para o seu telefone.
                </div>
              </div>
            </div>

            {/* Guia Passo a Passo */}
            <div className="bg-sf-panel rounded-2xl p-6 shadow-soft border border-black/[0.03]">
              <h3 className="text-lg font-serif text-sf-ink font-semibold mb-4">
                Como Instalar no seu Android
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {steps.map((step) => (
                  <div 
                    key={step.num}
                    className="bg-white/80 rounded-xl p-4 border border-black/[0.02] flex gap-3 shadow-2xs hover:shadow-xs transition duration-200"
                  >
                    <div className="w-8 h-8 rounded-full bg-sf-green text-sf-textBlack font-bold flex items-center justify-center shrink-0 shadow-2xs">
                      {step.num}
                    </div>
                    <div>
                      <h4 className="font-serif font-semibold text-sm text-sf-ink mb-1">
                        {step.title}
                      </h4>
                      <p className="text-xs text-zinc-650 leading-normal">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* Rodapé */}
      <footer className="py-6 text-center text-xs text-zinc-400 border-t border-black/[0.05] bg-white">
        &copy; {new Date().getFullYear()} Synchro Fit. Todos os direitos reservados.
      </footer>
    </div>
  );
}
