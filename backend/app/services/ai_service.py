import os
from typing import List, Dict, Any

from openai import OpenAI

OPENAI_CHAT_MODEL = os.getenv("OPENAI_CHAT_MODEL", "gpt-4o-mini")


def get_openai_client():
    api_key = os.getenv("OPENAI_API_KEY")

    if not api_key or api_key == "coloque_sua_chave_openai_aqui":
        raise ValueError("OPENAI_API_KEY não configurada no backend/.env")

    return OpenAI(api_key=api_key)


def generate_answer(question: str, chunks: List[Dict[str, Any]]) -> str:
    client = get_openai_client()

    context = "\n\n---\n\n".join(
        [
            f"Fonte: {chunk['document_name']}\nTrecho:\n{chunk['content']}"
            for chunk in chunks
        ]
    )

    response = client.chat.completions.create(
        model=OPENAI_CHAT_MODEL,
        messages=[
            {
                "role": "system",
                "content": (
                    "Você é um assistente de atendimento corporativo do DocAtende AI. "
                    "Responda apenas com base no contexto fornecido. "
                    "Se a resposta não estiver no contexto, informe de forma clara que não encontrou essa informação nos documentos enviados. "
                    "Responda em português do Brasil, com linguagem profissional, objetiva e fácil de entender."
                ),
            },
            {
                "role": "user",
                "content": f"Contexto:\n{context}\n\nPergunta:\n{question}",
            },
        ],
        temperature=0.2,
    )

    return response.choices[0].message.content