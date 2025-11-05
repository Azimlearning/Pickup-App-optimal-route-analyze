# Flask Backend Startup Script
$env:MAPS_API_KEY = "AIzaSyC59xUjyXya4SO-2abaaaeTnuuWUOcFFAo"
$env:OPENROUTER_API_KEY = "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"
$env:PORT = "8080"

Write-Host "Starting Flask backend on port 8080..." -ForegroundColor Green
Write-Host "Google Maps API Key: Set" -ForegroundColor Cyan
Write-Host "OpenRouter API Key: Set" -ForegroundColor Cyan
Write-Host ""

python app.py

