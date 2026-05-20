import json
import os
from pathlib import Path

from celery import Celery
from pypdf import PdfReader

broker_url = os.getenv("RABBITMQ_URL", "amqp://guest:guest@rabbitmq:5672//")
backend_url = os.getenv("REDIS_URL", "redis://redis:6379/0")

celery_app = Celery(
    "docatende_worker",
    broker=broker_url,
    backend=backend_url,
)

BASE_DIR = Path("/app/storage")
UPLOAD_DIR = BASE_DIR / "documents"
EXTRACTED_DIR = BASE_DIR / "extracted"
DB_FILE = BASE_DIR / "documents.json"


def ensure_storage():
    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
    EXTRACTED_DIR.mkdir(parents=True, exist_ok=True)

    if not DB_FILE.exists():
        DB_FILE.write_text("[]", encoding="utf-8")


def load_documents():
    ensure_storage()

    try:
        return json.loads(DB_FILE.read_text(encoding="utf-8"))
    except json.JSONDecodeError:
        return []


def save_documents(documents):
    ensure_storage()
    DB_FILE.write_text(
        json.dumps(documents, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )


def update_document_status(document_id: str, status: str, pages: int = 0, chunks: int = 0):
    documents = load_documents()

    for document in documents:
        if document["id"] == document_id:
            document["status"] = status
            document["pages"] = pages
            document["chunks"] = chunks
            break

    save_documents(documents)


def split_text_into_chunks(text: str, chunk_size: int = 1000):
    clean_text = " ".join(text.split())

    if not clean_text:
        return []

    chunks = []

    for index in range(0, len(clean_text), chunk_size):
        chunk = clean_text[index : index + chunk_size].strip()

        if chunk:
            chunks.append(chunk)

    return chunks


@celery_app.task(name="app.workers.celery_app.process_document_task")
def process_document_task(document_id: str):
    ensure_storage()

    documents = load_documents()

    document = next(
        (item for item in documents if item["id"] == document_id),
        None,
    )

    if not document:
        return {
            "document_id": document_id,
            "status": "not_found",
        }

    try:
        update_document_status(document_id, "Processando")

        file_path = UPLOAD_DIR / document["stored_filename"]

        if not file_path.exists():
            update_document_status(document_id, "Erro")
            return {
                "document_id": document_id,
                "status": "file_not_found",
            }

        reader = PdfReader(str(file_path))
        pages_count = len(reader.pages)

        extracted_pages = []

        for page in reader.pages:
            page_text = page.extract_text() or ""
            extracted_pages.append(page_text)

        full_text = "\n\n".join(extracted_pages).strip()
        chunks = split_text_into_chunks(full_text)

        extracted_file = EXTRACTED_DIR / f"{document_id}.txt"
        extracted_file.write_text(full_text, encoding="utf-8")

        documents = load_documents()

        for item in documents:
            if item["id"] == document_id:
                item["status"] = "Processado"
                item["pages"] = pages_count
                item["chunks"] = len(chunks)
                item["extracted_file"] = f"{document_id}.txt"
                break

        save_documents(documents)

        return {
            "document_id": document_id,
            "status": "processed",
            "pages": pages_count,
            "chunks": len(chunks),
        }

    except Exception as error:
        update_document_status(document_id, "Erro")

        return {
            "document_id": document_id,
            "status": "error",
            "error": str(error),
        }