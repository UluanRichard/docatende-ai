import json
import re
from pathlib import Path

from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(prefix="/chat", tags=["Chat RAG"])

BASE_DIR = Path("/app/storage")
DB_FILE = BASE_DIR / "documents.json"
EXTRACTED_DIR = BASE_DIR / "extracted"


class ChatRequest(BaseModel):
    question: str


def load_documents():
    if not DB_FILE.exists():
        return []

    try:
        return json.loads(DB_FILE.read_text(encoding="utf-8"))
    except json.JSONDecodeError:
        return []


def normalize_text(text: str):
    return re.sub(r"\s+", " ", text.lower()).strip()


def tokenize(text: str):
    stopwords = {
        "a", "o", "os", "as", "de", "da", "do", "das", "dos",
        "em", "para", "por", "com", "um", "uma", "que", "qual",
        "quais", "como", "quando", "onde", "e", "ou", "no", "na",
        "nos", "nas", "é", "ser", "sobre"
    }

    words = re.findall(r"\b\w+\b", normalize_text(text))

    return [
        word for word in words
        if len(word) > 2 and word not in stopwords
    ]


def split_text_into_chunks(text: str, chunk_size: int = 1200):
    clean_text = " ".join(text.split())

    if not clean_text:
        return []

    chunks = []

    for index in range(0, len(clean_text), chunk_size):
        chunk = clean_text[index:index + chunk_size].strip()

        if chunk:
            chunks.append(chunk)

    return chunks


def find_best_chunk(question: str):
    question_terms = tokenize(question)

    if not question_terms:
        return None

    documents = load_documents()
    processed_documents = [
        doc for doc in documents
        if doc.get("status") == "Processado" and doc.get("extracted_file")
    ]

    best_result = None

    for document in processed_documents:
        extracted_file = EXTRACTED_DIR / document["extracted_file"]

        if not extracted_file.exists():
            continue

        text = extracted_file.read_text(encoding="utf-8")
        chunks = split_text_into_chunks(text)

        for chunk in chunks:
            chunk_normalized = normalize_text(chunk)

            score = sum(
                1 for term in question_terms
                if term in chunk_normalized
            )

            if score == 0:
                continue

            if best_result is None or score > best_result["score"]:
                best_result = {
                    "score": score,
                    "chunk": chunk,
                    "document_name": document["name"],
                }

    return best_result


@router.post("/ask")
def ask_question(payload: ChatRequest):
    question = payload.question.strip()

    if not question:
        return {
            "answer": "Digite uma pergunta para consultar a base de conhecimento.",
            "source": None,
            "confidence": 0,
        }

    result = find_best_chunk(question)

    if not result:
        documents = load_documents()
        processed_documents = [
            doc for doc in documents
            if doc.get("status") == "Processado" and doc.get("extracted_file")
        ]

        if processed_documents:
            first_document = processed_documents[0]
            extracted_file = EXTRACTED_DIR / first_document["extracted_file"]

            if extracted_file.exists():
                text = extracted_file.read_text(encoding="utf-8")
                preview = " ".join(text.split())[:900]

                return {
                    "answer": (
                        "Não encontrei uma correspondência exata para a pergunta, "
                        "mas encontrei este trecho inicial do documento processado:\n\n"
                        f"{preview}"
                    ),
                    "source": first_document["name"],
                    "confidence": 1,
                }

        return {
            "answer": "Ainda não há documentos processados com texto extraído para consulta.",
            "source": None,
            "confidence": 0,
        }

    answer = (
        "Com base no documento encontrado, o trecho mais relevante é:\n\n"
        f"{result['chunk'][:900]}"
    )

    if len(result["chunk"]) > 900:
        answer += "..."

    return {
        "answer": answer,
        "source": result["document_name"],
        "confidence": result["score"],
    }