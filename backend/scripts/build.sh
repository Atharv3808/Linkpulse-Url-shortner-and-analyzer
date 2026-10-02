#!/usr/bin/env bash
# Render Build Script for LinkPulse Backend
set -o errexit

echo "📦 Installing production requirements..."
pip install -r requirements/production.txt

echo "🎨 Collecting static files..."
python manage.py collectstatic --noinput

echo "🗄️ Running database migrations..."
python manage.py migrate

echo "✅ Build completed successfully!"
