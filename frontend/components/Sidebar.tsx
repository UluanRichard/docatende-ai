import {
  BarChart3,
  Bot,
  Building2,
  FileText,
  LayoutDashboard,
  MessageSquare,
  Sparkles,
  Users,
} from "lucide-react";

type SidebarProps = {
  activePage: string;
  onChangePage: (page: string) => void;
};

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "documents", label: "Documentos", icon: FileText },
  { id: "chat", label: "Chat RAG", icon: MessageSquare },
  { id: "conversations", label: "Conversas", icon: Users },
  { id: "organizations", label: "Organizações", icon: Building2 },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
];

export function Sidebar({ activePage, onChangePage }: SidebarProps) {
  return (
    <aside className="fixed left-0 top-0 hidden h-full w-72 border-r border-slate-200 bg-white lg:block">
      <div className="flex h-full flex-col">
        <div className="border-b border-slate-100 p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-600 text-white shadow-sm">
              <Bot size={24} />
            </div>

            <div>
              <h1 className="text-lg font-black tracking-tight">DocAtende AI</h1>
              <p className="text-xs text-slate-500">demo@docatende.local</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-2 p-4 text-sm">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onChangePage(item.id)}
                className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left transition ${
                  isActive
                    ? "bg-slate-950 font-semibold text-white shadow-sm"
                    : "font-medium text-slate-600 hover:bg-slate-100"
                }`}
              >
                <Icon size={18} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="p-4">
          <div className="rounded-3xl border border-teal-100 bg-teal-50 p-4">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-teal-600 text-white">
              <Sparkles size={20} />
            </div>

            <h3 className="font-bold text-slate-900">Ambiente SaaS</h3>
            <p className="mt-1 text-xs leading-5 text-slate-600">
              Plataforma multiusuário com IA, RAG, embeddings e busca vetorial.
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}