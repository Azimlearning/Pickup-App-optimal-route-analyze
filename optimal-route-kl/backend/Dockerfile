# --- 1. Base Stage: Use a slim Python image ---
# Python 3.11 is a good modern version. Use 3.10-slim or 3.11-slim for production.
FROM python:3.11-slim AS builder

# Set the working directory for the app inside the container
WORKDIR /app

# --- 2. Install dependencies ---
# Copy and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# --- 3. Copy application code ---
# Copy the entire backend directory contents into the container
COPY . .

# --- 4. Container Configuration ---
# Cloud Run automatically sets the PORT environment variable.
# We expose a port, but Cloud Run dynamically routes traffic.
EXPOSE 8080 

# Define the command to run the application using Gunicorn.
# Syntax: gunicorn --bind <HOST>:<PORT> <MODULE>:<APP_OBJECT>
# We bind to 0.0.0.0 on the Cloud Run PORT, and target 'app.py' and the 'app' Flask object.
# Workers and threads are tunable, but these defaults are good for a start.
CMD exec gunicorn --bind :$PORT --workers 2 --threads 4 --timeout 0 app:app
