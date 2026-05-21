import os
from typing import List, Dict, Any

import psycopg2
from psycopg2.extras import RealDictCursor, execute_values
from openai import OpenAI

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://docatende:docatende_password_123@postgres:5432/docatende",
)

OPENAI_EMBEDDING_MODEL = os.getenv("OPENAI_EMBEDDING_MODEL", "text-embedding-3-small")

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


def get_connection():
    return psycopg2.connect(DATABASE_URL)


def init_vector_database():
    with get_connection() as conn:
        with conn.cursor() as cursor:
            cursor.execute("CREATE EXTENSION IF NOT EXISTS vector;")

            cursor.execute(
                """
                CREATE TABLE IF NOT EXISTS document_chunks (
                    id SERIAL PRIMARY KEY,
                    document_id TEXT NOT NULL,
                    document_name TEXT NOT NULL,
                    chunk_index INTEGER NOT NULL,
                    content TEXT NOT NULL,
                    embedding vector(1536),
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
                """
            )

            cursor.execute("DROP INDEX IF EXISTS document_chunks_embedding_idx;")

        conn.commit()


def create_embedding(text: str) -> List[float]:
    response = client.embeddings.create(
        model=OPENAI_EMBEDDING_MODEL,
        input=text,
    )

    return response.data[0].embedding


def save_document_chunks(
    document_id: str,
    document_name: str,
    chunks: List[str],
):
    if not chunks:
        return

    init_vector_database()

    rows = []

    for index, chunk in enumerate(chunks):
        embedding = create_embedding(chunk)

        rows.append(
            (
                document_id,
                document_name,
                index,
                chunk,
                embedding,
            )
        )

    with get_connection() as conn:
        with conn.cursor() as cursor:
            cursor.execute(
                "DELETE FROM document_chunks WHERE document_id = %s;",
                (document_id,),
            )

            execute_values(
                cursor,
                """
                INSERT INTO document_chunks
                    (document_id, document_name, chunk_index, content, embedding)
                VALUES %s;
                """,
                rows,
                template="(%s, %s, %s, %s, %s::vector)",
            )

        conn.commit()


def vector_to_pgvector(embedding: List[float]) -> str:
    return "[" + ",".join(str(value) for value in embedding) + "]"


def search_similar_chunks(question: str, limit: int = 4) -> List[Dict[str, Any]]:
    init_vector_database()

    question_embedding = create_embedding(question)
    question_vector = vector_to_pgvector(question_embedding)

    with get_connection() as conn:
        with conn.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute(
                """
                SELECT
                    document_id,
                    document_name,
                    chunk_index,
                    content,
                    1 - (embedding <=> %s::vector) AS similarity
                FROM document_chunks
                WHERE embedding IS NOT NULL
                ORDER BY embedding <=> %s::vector
                LIMIT %s;
                """,
                (question_vector, question_vector, limit),
            )

            results = cursor.fetchall()

            return [dict(row) for row in results]