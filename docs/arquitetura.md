# Arquitetura do DocAtende AI

## Visão geral

O DocAtende AI é uma plataforma SaaS de atendimento inteligente com IA.

## Componentes

- Frontend Next.js
- Backend FastAPI
- PostgreSQL com pgvector
- Redis
- RabbitMQ
- Celery Worker
- OpenAI API

## Fluxo principal

1. Usuário envia um PDF.
2. Backend recebe o arquivo.
3. Uma tarefa assíncrona é enviada para a fila.
4. O worker processa o documento.
5. O texto é dividido em chunks.
6. São gerados embeddings.
7. Os vetores são salvos no PostgreSQL com pgvector.
8. O chat consulta a base usando RAG.
