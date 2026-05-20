import os
from celery import Celery

broker_url = os.getenv("RABBITMQ_URL", "amqp://guest:guest@rabbitmq:5672//")
backend_url = os.getenv("REDIS_URL", "redis://redis:6379/0")

celery_app = Celery(
    "docatende_worker",
    broker=broker_url,
    backend=backend_url,
)


@celery_app.task
def process_document_task(document_id: int):
    return {
        "document_id": document_id,
        "status": "processed",
    }
