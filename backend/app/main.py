from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.documents import router as documents_router

app = FastAPI(
    title="DocAtende AI API",
    description="API da plataforma SaaS DocAtende AI para atendimento inteligente com IA e documentos corporativos.",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(documents_router)


@app.get("/")
def home():
    return {
        "message": "DocAtende AI API está online",
        "docs": "/docs",
        "status": "running",
    }


@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "service": "DocAtende AI API",
    }