from datetime import datetime
from pathlib import Path
from uuid import uuid4
import json
import shutil
from app.workers.celery_app import process_document_task

from fastapi import APIRouter, File, HTTPException, UploadFile

router = APIRouter(prefix="/documents", tags=["Documents"])

BASE_DIR = Path("/app/storage")
UPLOAD_DIR = BASE_DIR / "documents"
DB_FILE = BASE_DIR / "documents.json"


def ensure_storage():
    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

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


@router.get("")
def list_documents():
    documents = load_documents()

    return {
        "total": len(documents),
        "documents": documents,
    }


@router.post("/upload")
def upload_document(file: UploadFile = File(...)):
    ensure_storage()

    if not file.filename:
        raise HTTPException(status_code=400, detail="Arquivo inválido.")

    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=400,
            detail="Apenas arquivos PDF são permitidos.",
        )

    document_id = str(uuid4())
    safe_filename = file.filename.replace(" ", "_")
    stored_filename = f"{document_id}_{safe_filename}"
    file_path = UPLOAD_DIR / stored_filename

    with file_path.open("wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    documents = load_documents()

    document = {
      "id": document_id,
      "name": file.filename,
      "stored_filename": stored_filename,
      "status": "Fila",
      "pages": 0,
      "chunks": 0,
      "created_at": datetime.now().strftime("%d/%m/%Y %H:%M"),
    }

    documents.insert(0, document)
    save_documents(documents)

    process_document_task.delay(document_id)

    return {
        "message": "Documento enviado com sucesso.",
        "document": document,
    }


@router.delete("/{document_id}")
def delete_document(document_id: str):
    documents = load_documents()

    document = next((item for item in documents if item["id"] == document_id), None)

    if not document:
        raise HTTPException(status_code=404, detail="Documento não encontrado.")

    file_path = UPLOAD_DIR / document["stored_filename"]

    if file_path.exists():
        file_path.unlink()

    updated_documents = [
        item for item in documents if item["id"] != document_id
    ]

    save_documents(updated_documents)

    return {
        "message": "Documento removido com sucesso.",
        "id": document_id,
    }