import { Search } from "lucide-react";

type HeaderProps = {
  title: string;
  subtitle: string;
  isRefreshing: boolean;
  onRefresh: () => void;
};

export function Header({
  title,
  subtitle,
  isRefreshing,
  onRefresh,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 px-6 py-4 backdrop-blur">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-700">
            Atendimento inteligente com IA
          </p>
          <h2 className="mt-1 text-2xl font-black tracking-tight">{title}</h2>
          <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-500 md:flex">
            <Search size={16} />
            Buscar conversas, documentos ou usuários
          </div>

          <button
            onClick={onRefresh}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
          >
            {isRefreshing ? "Atualizando..." : "Atualizar"}
          </button>

          <button
            onClick={() =>
              alert("Função de logout será implementada na etapa de autenticação.")
            }
            className="rounded-2xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
          >
            Sair
          </button>
        </div>
      </div>
    </header>
  );
}