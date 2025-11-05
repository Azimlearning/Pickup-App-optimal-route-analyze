# Minimal Dockerfile for Cloud Run
FROM python:3.11-slim

# Set working dir
WORKDIR /app

# Install build deps, copy requirements, install
COPY requirements.txt .
RUN apt-get update && apt-get install -y --no-install-recommends gcc \
    && pip install --no-cache-dir -r requirements.txt \
    && apt-get remove -y gcc \
    && apt-get autoremove -y \
    && rm -rf /var/lib/apt/lists/*

# Copy app
COPY . .

# Use a non-root user for security (optional)
RUN useradd -m appuser
USER appuser

# Expose port
ENV PORT=8080
CMD exec uvicorn main:app --host 0.0.0.0 --port ${PORT}