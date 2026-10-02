.PHONY: setup backend-dev frontend-dev test-backend test-frontend build-frontend seed-data

setup:
	@echo "Setting up backend..."
	cd backend && python3 -m venv .venv && source .venv/bin/activate && pip install -r requirements/development.txt && python manage.py migrate
	@echo "Setting up frontend..."
	cd frontend && npm install
	@echo "Setup complete!"

backend-dev:
	cd backend && source .venv/bin/activate && python manage.py runserver 0.0.0.0:8000

frontend-dev:
	cd frontend && npm run dev

test-backend:
	cd backend && source .venv/bin/activate && DATABASE_URL=sqlite:///db.sqlite3 pytest

test-frontend:
	cd frontend && npx vitest run

build-frontend:
	cd frontend && npm run build

seed-data:
	cd backend && source .venv/bin/activate && DATABASE_URL=sqlite:///db.sqlite3 python manage.py seed_data
