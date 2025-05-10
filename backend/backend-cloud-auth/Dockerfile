    FROM python:3.12-slim

    # Configuración básica
    ENV PYTHONDONTWRITEBYTECODE=1
    ENV PYTHONUNBUFFERED=1

    WORKDIR /app

    # Dependencias del sistema
    RUN apt-get update && apt-get install -y --no-install-recommends \
        gcc libmariadb-dev-compat libmariadb-dev pkg-config \
        && rm -rf /var/lib/apt/lists/*

    # Poetry
    RUN pip install --upgrade pip && pip install poetry

    COPY pyproject.toml poetry.lock* /app/
    RUN poetry config virtualenvs.create false \
        && poetry install --no-interaction --no-ansi --no-root

    # Copia el código fuente
    COPY . /app/

    # Exponer puerto de la app
    EXPOSE 8000

    # Iniciar el servidor en producción (sin migraciones)
    CMD ["gunicorn", "core.wsgi:application", "--bind", "0.0.0.0:8000"]