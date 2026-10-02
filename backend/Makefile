.PHONY: migrate makemigrations test lint format seed superuser shell runserver

runserver:
	python manage.py runserver 0.0.0.0:8000

migrate:
	python manage.py migrate

makemigrations:
	python manage.py makemigrations

test:
	DATABASE_URL=sqlite:///db.sqlite3 pytest

lint:
	ruff check .

format:
	black .

seed:
	python manage.py seed_data

superuser:
	python manage.py createsuperuser

shell:
	python manage.py shell
