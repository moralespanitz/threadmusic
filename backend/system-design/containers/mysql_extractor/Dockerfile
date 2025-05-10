FROM --platform=linux/amd64 python:3.11-slim

WORKDIR /app

# Copiar los archivos de requisitos y el script
COPY requirements.txt .
COPY mysql_extractor/extractor.py .

# Instalar las dependencias
RUN pip install --no-cache-dir -r requirements.txt

# Crear el directorio de salida
RUN mkdir -p /data/output

# Ejecutar el script
CMD ["python", "extractor.py"]