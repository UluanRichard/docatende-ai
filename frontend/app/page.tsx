"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  BarChart3,
  CheckCircle2,
  Clock3,
  FileText,
  MessageCircle,
  MessageSquare,
  Send,
  ShieldCheck,
  UploadCloud,
  Users,
} from "lucide-react";
import { Sidebar } from "../components/Sidebar";
import { Header } from "../components/Header";
const API_URL =
  typeof window !== "undefined"
    ? `${window.location.protocol}//${window.location.hostname}:8000`
    : "http://localhost:8000";

type ChatMessage = {
  role: "assistant" | "user";
  text: string;
  source?: string;
};

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

const pageInfo: Record<string, { title: string; subtitle: string }> = {
  dashboard: {
    title: "Painel operacional",
    subtitle: "Visão geral do atendimento inteligente e operação SaaS.",
  },
  documents: {
    title: "Documentos",
    subtitle: "Envie, processe e acompanhe documentos da base de conhecimento.",
  },
  chat: {
    title: "Chat RAG",
    subtitle: "Faça perguntas com base nos documentos processados.",
  },
  conversations: {
    title: "Conversas",
    subtitle: "Acompanhe o histórico de atendimentos e interações.",
  },
  organizations: {
    title: "Organizações",
    subtitle: "Gerencie empresas, usuários e estrutura multiusuário.",
  },
  analytics: {
    title: "Analytics",
    subtitle: "Indicadores de atendimento, uso da base e performance da IA.",
  },
};

type DocumentItem = {
  id: string;
  name: string;
  stored_filename: string;
  status: string;
  pages: number;
  chunks: number;
  created_at: string;
};

export default function Home() {
  const [activePage, setActivePage] = useState("dashboard");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [question, setQuestion] = useState("");
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      text: "Olá! Envie uma pergunta para consultar os PDFs da sua organização.",
    },
    {
      role: "user",
      text: "Qual o prazo para solicitar reembolso?",
    },
    {
      role: "assistant",
      text: "De acordo com a política enviada, o prazo para solicitação de reembolso é de até 30 dias após a realização do procedimento, mediante apresentação da documentação necessária.",
      source: "politica-reembolso-demo.pdf",
    },
  ]);

  const currentPage = useMemo(() => pageInfo[activePage], [activePage]);

  async function handleRefresh() {
  setIsRefreshing(true);

  await loadDocuments();

  setTimeout(() => {
    setIsRefreshing(false);
    alert("Dados atualizados com sucesso.");
  }, 500);
}

  async function handleUpload() {
  if (!selectedFile) {
    alert("Selecione um arquivo PDF antes de enviar.");
    return;
  }

  try {
    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", selectedFile);

    const response = await fetch(`${API_URL}/documents/upload`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Erro ao enviar documento.");
    }

    setSelectedFile(null);
    await loadDocuments();

    alert("Documento enviado com sucesso.");
  } catch (error) {
    console.error(error);
    alert("Não foi possível enviar o documento.");
  } finally {
    setIsUploading(false);
  }
}

async function loadDocuments() {
  try {
    const response = await fetch(`${API_URL}/documents`);

    if (!response.ok) {
      throw new Error("Erro ao buscar documentos.");
    }

    const data = await response.json();
    setDocuments(data.documents || []);
  } catch (error) {
    console.error(error);
    alert("Não foi possível carregar os documentos.");
  }
}

useEffect(() => {
  loadDocuments();
}, []);
  function handleAskQuestion() {
    if (!question.trim()) {
      alert("Digite uma pergunta antes de enviar.");
      return;
    }

    const userQuestion = question;

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        text: userQuestion,
      },
      {
        role: "assistant",
        text: "Resposta simulada: com base nos documentos enviados, a informação foi localizada na base de conhecimento. Na próxima etapa, essa resposta será gerada pelo backend usando RAG real.",
        source: "base-conhecimento-demo.pdf",
      },
    ]);

    setQuestion("");
  }

  return (
    <main className="min-h-screen bg-[#F5F7FB] text-slate-950">
      <Sidebar activePage={activePage} onChangePage={setActivePage} />

      <section className="lg:ml-72">
        <Header
          title={currentPage.title}
          subtitle={currentPage.subtitle}
          isRefreshing={isRefreshing}
          onRefresh={handleRefresh}
        />

        <div className="space-y-6 p-6">
          {activePage === "dashboard" && <DashboardSection documents={documents} />}
          {activePage === "documents" && (
            <DocumentsSection
              documents={documents}
              selectedFile={selectedFile}
              isUploading={isUploading}
              onSelectFile={setSelectedFile}
              onUpload={handleUpload}
        />
          )}
          {activePage === "chat" && (
            <ChatSection
              messages={messages}
              question={question}
              onQuestionChange={setQuestion}
              onAsk={handleAskQuestion}
            />
          )}
          {activePage === "conversations" && <ConversationsSection />}
          {activePage === "organizations" && <OrganizationsSection />}
          {activePage === "analytics" && <AnalyticsSection />}
        </div>
      </section>
    </main>
  );
}

function DashboardSection({ documents }: { documents: DocumentItem[] }) {
  return (
    <>
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
              {[
                "FastAPI",
                "Next.js",
                "PostgreSQL + pgvector",
                "OpenAI",
                "RabbitMQ + Celery",
              ].map((item) => (
                <span
                  key={item}
                  className="rounded-full bg-teal-500/20 px-4 py-2 text-sm font-medium text-teal-100"
                >
                  {item}
                </span>
              ))}
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

      <MetricsGrid />

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <DocumentsPreview documents={documents} />
        <ChatPreview />
      </div>

      <AnalyticsSection />
    </>
  );
}

function MetricsGrid() {
  return (
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

            <p className="text-sm font-medium text-slate-500">{metric.label}</p>
            <p className="mt-2 text-3xl font-black tracking-tight">
              {metric.value}
            </p>
            <p className="mt-1 text-xs text-slate-400">{metric.helper}</p>
          </div>
        );
      })}
    </section>
  );
}

function DocumentsSection({
  documents,
  selectedFile,
  isUploading,
  onSelectFile,
  onUpload,
}: {
  documents: DocumentItem[];
  selectedFile: File | null;
  isUploading: boolean;
  onSelectFile: (file: File | null) => void;
  onUpload: () => void;
}) {
  return (
    <section className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <FileText className="text-teal-700" size={20} />
            <h3 className="text-lg font-black">Base de conhecimento</h3>
          </div>
          <p className="text-sm text-slate-500">
            Faça upload de PDFs para alimentar a base de conhecimento.
          </p>
        </div>

        <button
          onClick={onUpload}
          className="flex items-center justify-center gap-2 rounded-2xl bg-teal-600 px-4 py-3 text-sm font-bold text-white shadow-sm hover:bg-teal-700"
        >
          <UploadCloud size={17} />
          {isUploading ? "Enviando..." : "Enviar documento"}
        </button>
      </div>

      <label className="mb-5 block cursor-pointer rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center hover:border-teal-400">
        <UploadCloud className="mx-auto mb-3 text-teal-700" size={32} />
        <p className="font-semibold">Clique para selecionar um PDF</p>
        <p className="mt-1 text-xs text-slate-500">
          O processamento real será conectado ao backend na próxima etapa.
        </p>

        <input
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0] || null;
            onSelectFile(file);
          }}
        />
      </label>

      {selectedFile && (
        <div className="mb-5 rounded-2xl border border-teal-200 bg-teal-50 p-4 text-sm text-teal-800">
          Arquivo selecionado: <strong>{selectedFile.name}</strong>
        </div>
      )}

      <DocumentsTable documents={documents} />
    </section>
  );
}

function DocumentsPreview({ documents }: { documents: DocumentItem[] }) {
  return (
    <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center gap-2">
        <FileText className="text-teal-700" size={20} />
        <h3 className="text-lg font-black">Base de conhecimento</h3>
      </div>

      <DocumentsTable documents={documents} />
    </div>
  );
}

function DocumentsTable({ documents }: { documents: DocumentItem[] }) {
  return (
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
  {documents.length === 0 && (
    <tr>
      <td
        colSpan={5}
        className="p-6 text-center text-sm text-slate-500"
      >
        Nenhum documento enviado ainda.
      </td>
    </tr>
  )}

  {documents.map((doc) => (
    <tr key={doc.id} className="border-t border-slate-200">
      <td className="p-4 font-medium text-slate-700">{doc.name}</td>

      <td className="p-4">
        <span
          className={`rounded-full px-3 py-1 text-xs font-bold ${
            doc.status === "Processado"
              ? "bg-teal-50 text-teal-700"
              : doc.status === "Recebido"
              ? "bg-blue-50 text-blue-700"
              : "bg-amber-50 text-amber-700"
          }`}
        >
          {doc.status}
        </span>
      </td>

      <td className="p-4 text-slate-500">{doc.pages}</td>
      <td className="p-4 text-slate-500">{doc.chunks}</td>
      <td className="p-4 text-slate-500">{doc.created_at}</td>
    </tr>
  ))}
       </tbody>
      </table>
    </div>
  );
}

function ChatSection({
  messages,
  question,
  onQuestionChange,
  onAsk,
}: {
  messages: ChatMessage[];
  question: string;
  onQuestionChange: (value: string) => void;
  onAsk: () => void;
}) {
  return (
    <section className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center gap-2">
        <MessageSquare className="text-teal-700" size={20} />
        <div>
          <h3 className="text-lg font-black">Chat RAG</h3>
          <p className="text-sm text-slate-500">
            Faça perguntas com base nos documentos processados.
          </p>
        </div>
      </div>

      <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`max-w-[90%] rounded-2xl p-4 text-sm shadow-sm ${
              message.role === "user"
                ? "ml-auto bg-teal-600 text-white"
                : "bg-white text-slate-600"
            }`}
          >
            {message.text}

            {message.source && (
              <div className="mt-3 rounded-xl bg-teal-50 px-3 py-2 text-xs font-semibold text-teal-700">
                Fonte: {message.source}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-4 flex gap-2">
        <input
          value={question}
          onChange={(event) => onQuestionChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              onAsk();
            }
          }}
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-teal-500"
          placeholder="Digite sua pergunta..."
        />

        <button
          onClick={onAsk}
          className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-600 text-white shadow-sm hover:bg-teal-700"
        >
          <Send size={18} />
        </button>
      </div>
    </section>
  );
}

function ChatPreview() {
  return (
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

      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <div className="rounded-2xl bg-white p-4 text-sm text-slate-600 shadow-sm">
          Resposta simulada baseada na política de reembolso.
          <div className="mt-3 rounded-xl bg-teal-50 px-3 py-2 text-xs font-semibold text-teal-700">
            Fonte: politica-reembolso-demo.pdf
          </div>
        </div>
      </div>
    </div>
  );
}

function ConversationsSection() {
  return (
    <section className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center gap-2">
        <Users className="text-teal-700" size={20} />
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
    </section>
  );
}

function OrganizationsSection() {
  return (
    <section className="grid gap-4 md:grid-cols-3">
      {[
        ["Unimed Demo", "24 usuários", "Base de atendimento corporativo"],
        ["Empresa Comercial", "11 usuários", "Base de vendas e suporte"],
        ["Operação Interna", "8 usuários", "Base de políticas e processos"],
      ].map(([name, users, description]) => (
        <div
          key={name}
          className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm"
        >
          <ShieldCheck className="mb-4 text-teal-700" size={24} />
          <h3 className="font-black">{name}</h3>
          <p className="mt-2 text-sm text-slate-500">{users}</p>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            {description}
          </p>
        </div>
      ))}
    </section>
  );
}

function AnalyticsSection() {
  return (
    <section className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
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
    </section>
  );
}