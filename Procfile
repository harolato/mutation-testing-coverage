web: daphne config.asgi:application --port $PORT --bind 0.0.0.0
worker: celery --app=config.celery:app worker
release: python manage.py migrate