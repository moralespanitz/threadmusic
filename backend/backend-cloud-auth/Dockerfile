FROM python:3.12-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# System deps
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc libmariadb-dev-compat libmariadb-dev pkg-config \
    && rm -rf /var/lib/apt/lists/*

# Poetry
RUN pip install --upgrade pip \
    && pip install poetry

COPY pyproject.toml poetry.lock* /app/

RUN poetry config virtualenvs.create false \
    && poetry install --no-interaction --no-ansi --no-root

COPY . /app/

# Colectar estáticos y migraciones
RUN python manage.py collectstatic --noinput
RUN python manage.py migrate

# Exponer puerto
EXPOSE 8000

# Usar gunicorn para producción
CMD ["gunicorn", "core.wsgi:application", "--bind", "0.0.0.0:8000"]
