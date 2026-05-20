import {
  Activity,
  BarChart3,
  Bot,
  Building2,
  CheckCircle2,
  Clock3,
  Database,
  FileText,
  LayoutDashboard,
  MessageCircle,
  MessageSquare,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  UploadCloud,
  Users,
} from "lucide-react";

const metrics = [
  {
    label: "Conversas",
    value: "248",
    helper: "+18% nos últimos 7 dias",
    icon: MessageCircle,
  },
  {
    label: "Documentos",
    value: "36",
    helper: "32 processados com sucesso",
    icon: FileText,
  },
  {
    label: "Latência média",
    value: "842ms",
    helper: "tempo médio de resposta",
    icon: Clock3,
  },
  {
    label: "Base pronta",
    value: "98%",
    helper: "RAG disponível",
    icon: CheckCircle2,
  },
];

const documents = [
  {
    name: "politica-reembolso-demo.pdf",
    status: "Processado",
    pages: 12,
    chunks: 48,
    date: "20/05/2026",
  },
  {
    name: "manual-atendimento-sac.pdf",
    status: "Processado",
    pages: 27,
    chunks: 119,
    date: "20/05/2026",
  },
  {
    name: "faq-comercial.pdf",
    status: "Fila",
    pages: 8,
    chunks: 0,
    date: "20/05/2026",
  },
];

const conversations = [
  {
    name: "Cliente Operacional",
    message: "Qual o prazo para reembolso?",
    time: "há 2 min",
  },
  {
    name: "Equipe Comercial",
    message: "Existe política para cancelamento?",
    time: "há 9 min",
  },
  {
    name: "Suporte Interno",
    message: "Como consultar documentos enviados?",
    time: "há 18 min",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#F5F7FB] text-slate-950">
      <aside className="fixed left-0 top-0 hidden h-full w-72 border-r border-slate-200 bg-white lg:block">
        <div className="flex h-full flex-col">
          <div className="border-b border-slate-100 p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-600 text-white shadow-sm">
                <Bot size={24} />
              </div>

              <div>
                <h1 className="text-lg font-black tracking-tight">DocAtende AI</h1>
                <p className="text-xs text-slate-500">demo@docatendeai.local</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 space-y-2 p-4 text-sm">
            <a className="flex items-center gap-3 rounded-2xl bg-slate-950 px-4 py-3 font-semibold text-white shadow-sm">
              <LayoutDashboard size={18} />
              Dashboard
            </a>

            <a className="flex items-center gap-3 rounded-2xl px-4 py-3 font-medium text-slate-600 hover:bg-slate-100">
              <FileText size={18} />
              Documentos
            </a>

            <a className="flex items-center gap-3 rounded-2xl px-4 py-3 font-medium text-slate-600 hover:bg-slate-100">
              <MessageSquare size={18} />
              Chat RAG
            </a>

            <a className="flex items-center gap-3 rounded-2xl px-4 py-3 font-medium text-slate-600 hover:bg-slate-100">
              <Users size={18} />
              Conversas
            </a>

            <a className="flex items-center gap-3 rounded-2xl px-4 py-3 font-medium text-slate-600 hover:bg-slate-100">
              <Building2 size={18} />
              Organizações
            </a>

            <a className="flex items-center gap-3 rounded-2xl px-4 py-3 font-medium text-slate-600 hover:bg-slate-100">
              <BarChart3 size={18} />
              Analytics
            </a>
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

      <section className="lg:ml-72">
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 px-6 py-4 backdrop-blur">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-700">
                Atendimento inteligente com IA
              </p>
              <h2 className="mt-1 text-2xl font-black tracking-tight">
                Painel operacional
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-500 md:flex">
                <Search size={16} />
                Buscar conversas, documentos ou usuários
              </div>

              <button className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50">
                Atualizar
              </button>

              <button className="rounded-2xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800">
                Sair
              </button>
            </div>
          </div>
        </header>

        <div className="space-y-6 p-6">
          <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-950 text-white shadow-sm">
            <div className="grid gap-6 p-8 xl:grid-cols-[1.4fr_0.8fr]">
              <div>
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm text-teal-100">
                  <Activity size={16} />
                  Demo carregada com base de conhecimento pronta
                </div>

                <h3 className="max-w-3xl text-3xl font-black leading-tight tracking-tight md:text-4xl">
                  Transforme documentos internos em atendimento inteligente com IA.
                </h3>

                <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 md:text-base">
                  O DocAtende AI centraliza PDFs, processa documentos em segundo plano,
                  cria embeddings, realiza busca vetorial com pgvector e responde
                  perguntas usando RAG com rastreabilidade por usuário e organização.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <span className="rounded-full bg-teal-500/20 px-4 py-2 text-sm font-medium text-teal-100">
                    FastAPI
                  </span>
                  <span className="rounded-full bg-teal-500/20 px-4 py-2 text-sm font-medium text-teal-100">
                    Next.js
                  </span>
                  <span className="rounded-full bg-teal-500/20 px-4 py-2 text-sm font-medium text-teal-100">
                    PostgreSQL + pgvector
                  </span>
                  <span className="rounded-full bg-teal-500/20 px-4 py-2 text-sm font-medium text-teal-100">
                    OpenAI
                  </span>
                  <span className="rounded-full bg-teal-500/20 px-4 py-2 text-sm font-medium text-teal-100">
                    RabbitMQ + Celery
                  </span>
                </div>
              </div>

              <div className="rounded-[1.5rem] border border-white/10 bg-white/10 p-5">
                <h4 className="mb-4 font-bold">Status da operação</h4>

                <div className="space-y-3">
                  {[
                    ["API", "Online"],
                    ["Fila", "RabbitMQ ativo"],
                    ["Vetores", "pgvector disponível"],
                    ["Worker", "Celery processando"],
                  ].map(([label, status]) => (
                    <div
                      key={label}
                      className="flex items-center justify-between rounded-2xl bg-white/10 px-4 py-3 text-sm"
                    >
                      <span className="text-slate-300">{label}</span>
                      <span className="font-semibold text-teal-100">{status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {metrics.map((metric) => {
              const Icon = metric.icon;

              return (
                <div
                  key={metric.label}
                  className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="mb-5 flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
                      <Icon size={20} />
                    </div>

                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
                      Live
                    </span>
                  </div>

                  <p className="text-sm font-medium text-slate-500">
                    {metric.label}
                  </p>
                  <p className="mt-2 text-3xl font-black tracking-tight">
                    {metric.value}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">{metric.helper}</p>
                </div>
              );
            })}
          </section>

          <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <FileText className="text-teal-700" size={20} />
                    <h3 className="text-lg font-black">Base de conhecimento</h3>
                  </div>
                  <p className="text-sm text-slate-500">
                    PDFs enviados para processamento assíncrono e busca vetorial.
                  </p>
                </div>

                <button className="flex items-center justify-center gap-2 rounded-2xl bg-teal-600 px-4 py-3 text-sm font-bold text-white shadow-sm hover:bg-teal-700">
                  <UploadCloud size={17} />
                  Novo documento
                </button>
              </div>

              <div className="mb-5 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-center">
                <UploadCloud className="mx-auto mb-3 text-teal-700" size={28} />
                <p className="font-semibold">Arraste PDFs ou selecione arquivos</p>
                <p className="mt-1 text-xs text-slate-500">
                  Os documentos serão enviados para fila e processados pelo worker.
                </p>
              </div>

              <div className="overflow-hidden rounded-2xl border border-slate-200">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="p-4">Arquivo</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Páginas</th>
                      <th className="p-4">Chunks</th>
                      <th className="p-4">Criado em</th>
                    </tr>
                  </thead>
                  <tbody>
                    {documents.map((doc) => (
                      <tr key={doc.name} className="border-t border-slate-200">
                        <td className="p-4 font-medium text-slate-700">
                          {doc.name}
                        </td>
                        <td className="p-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-bold ${
                              doc.status === "Processado"
                                ? "bg-teal-50 text-teal-700"
                                : "bg-amber-50 text-amber-700"
                            }`}
                          >
                            {doc.status}
                          </span>
                        </td>
                        <td className="p-4 text-slate-500">{doc.pages}</td>
                        <td className="p-4 text-slate-500">{doc.chunks}</td>
                        <td className="p-4 text-slate-500">{doc.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center gap-2">
                <MessageSquare className="text-teal-700" size={20} />
                <div>
                  <h3 className="text-lg font-black">Chat RAG</h3>
                  <p className="text-sm text-slate-500">
                    Respostas baseadas nos documentos processados.
                  </p>
                </div>
              </div>

              <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="max-w-[85%] rounded-2xl bg-white p-4 text-sm text-slate-600 shadow-sm">
                  Olá! Envie uma pergunta para consultar os PDFs da sua organização.
                </div>

                <div className="ml-auto max-w-[85%] rounded-2xl bg-teal-600 p-4 text-sm text-white shadow-sm">
                  Qual o prazo para solicitar reembolso?
                </div>

                <div className="max-w-[90%] rounded-2xl bg-white p-4 text-sm leading-6 text-slate-600 shadow-sm">
                  De acordo com a política enviada, o prazo para solicitação de
                  reembolso é de até 30 dias após a realização do procedimento,
                  mediante apresentação da documentação necessária.
                  <div className="mt-3 rounded-xl bg-teal-50 px-3 py-2 text-xs font-semibold text-teal-700">
                    Fonte: politica-reembolso-demo.pdf
                  </div>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <input
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-teal-500"
                  placeholder="Digite sua pergunta..."
                />
                <button className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-600 text-white shadow-sm hover:bg-teal-700">
                  <Send size={18} />
                </button>
              </div>
            </div>
          </section>

          <section className="grid gap-6 xl:grid-cols-3">
            <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm xl:col-span-2">
              <div className="mb-5 flex items-center gap-2">
                <BarChart3 className="text-teal-700" size={20} />
                <h3 className="text-lg font-black">Analytics e KPIs</h3>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                {[
                  ["Taxa de resolução", "91%", "sem intervenção humana"],
                  ["Documentos úteis", "84%", "usados nas respostas"],
                  ["Satisfação simulada", "4.8/5", "baseado em feedbacks"],
                ].map(([label, value, helper]) => (
                  <div
                    key={label}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
                  >
                    <p className="text-sm text-slate-500">{label}</p>
                    <p className="mt-2 text-2xl font-black">{value}</p>
                    <p className="mt-1 text-xs text-slate-400">{helper}</p>
                  </div>
                ))}
              </div>

              <div className="mt-5 h-52 rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-teal-50 p-5">
                <div className="flex h-full items-end gap-3">
                  {[45, 64, 52, 80, 72, 92, 76, 88, 96, 84, 91, 98].map(
                    (height, index) => (
                      <div
                        key={index}
                        className="flex flex-1 items-end rounded-t-xl bg-teal-600/80"
                        style={{ height: `${height}%` }}
                      />
                    )
                  )}
                </div>
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center gap-2">
                <ShieldCheck className="text-teal-700" size={20} />
                <h3 className="text-lg font-black">Conversas recentes</h3>
              </div>

              <div className="space-y-3">
                {conversations.map((item) => (
                  <div
                    key={item.name}
                    className="rounded-2xl border border-slate-200 p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-bold text-slate-800">{item.name}</p>
                      <span className="text-xs text-slate-400">{item.time}</span>
                    </div>
                    <p className="mt-2 text-sm text-slate-500">{item.message}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-3">
            {[
              [Database, "Banco vetorial", "PostgreSQL com pgvector para busca semântica."],
              [Bot, "IA generativa", "OpenAI, embeddings e respostas contextualizadas."],
              [ShieldCheck, "Multiusuário", "JWT, organizações, usuários e isolamento por tenant."],
            ].map(([Icon, label, description]: any) => (
              <div
                key={label}
                className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
                  <Icon size={22} />
                </div>
                <h3 className="font-black">{label}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {description}
                </p>
              </div>
            ))}
          </section>
        </div>
      </section>
    </main>
  );
}