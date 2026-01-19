FROM python:3.11-slim

WORKDIR /app

# Install system dependencies for running code in sandbox
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    nodejs \
    npm \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements from backend
COPY ../backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code (shared with worker)
COPY ../backend/ .

# Run Celery worker
CMD ["celery", "-A", "celery_app", "worker", "--loglevel=info", "--concurrency=4"]
