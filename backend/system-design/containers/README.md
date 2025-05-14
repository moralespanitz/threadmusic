# Database Extractors for AWS S3

Este sistema implementa tres contenedores Docker independientes para extraer datos de bases de datos:
- **MySQL Extractor**: Extrae datos de bases de datos MySQL
- **PostgreSQL Extractor**: Extrae datos de bases de datos PostgreSQL
- **MongoDB Extractor**: Extrae datos de bases de datos MongoDB

Cada contenedor implementa una estrategia de pull para ingestar el 100% de los registros de las tablas/colecciones periódicamente, generando archivos CSV que se cargan automáticamente en un bucket S3.

## Características

- **Extracción de datos completa**: Extrae todos los registros de todas las tablas/colecciones
- **Estrategia Pull**: Los extractores se ejecutan continuamente a intervalos configurables
- **Organización por base de datos**: Los archivos se organizan en carpetas separadas por cada base de datos y tabla
- **Versionado temporal**: Los archivos incluyen timestamp para mantener un histórico
- **Carga automática a S3**: Los datos extraídos se cargan automáticamente a un bucket S3
- **Limpieza de archivos locales**: Los archivos locales se eliminan después de la carga a S3

## Requisitos

- Docker y Docker Compose
- Credenciales AWS con acceso de escritura a S3
- Acceso a las bases de datos de origen

## Configuración

### Variables de entorno

Crea un archivo `.env` en el directorio raíz con las siguientes variables:

```
# MySQL
MYSQL_HOST=host_mysql
MYSQL_USER=usuario
MYSQL_PASSWORD=contraseña
MYSQL_DATABASE=nombre_bd

# PostgreSQL
PG_HOST=host_postgres
PG_USER=usuario
PG_PASSWORD=contraseña
PG_DATABASE=nombre_bd

# MongoDB
MONGO_URI=mongodb://usuario:contraseña@host:puerto
MONGO_DATABASE=nombre_bd

# AWS
AWS_ACCESS_KEY_ID=tu_access_key
AWS_SECRET_ACCESS_KEY=tu_secret_key
AWS_SESSION_TOKEN=tu_session_token (opcional)
S3_BUCKET_NAME=nombre_bucket
```

### Intervalos de Extracción

Por defecto, la extracción se realiza cada hora (3600 segundos). Para cambiar este intervalo, añade a tu `.env`:

```
EXTRACTION_INTERVAL=1800  # Ejemplo: cada 30 minutos
```

## Ejecución

Para iniciar todos los extractores:

```bash
docker-compose up -d
```

Para iniciar un extractor específico:

```bash
docker-compose up -d mysql-extractor
docker-compose up -d postgresql-extractor
docker-compose up -d mongodb-extractor
```

## Estructura en S3

Los datos se organizan en S3 con la siguiente estructura:

```
bucket/
  ├── mysql_data/
  │   ├── tabla1/
  │   │   ├── tabla1_20240815_123045.csv
  │   │   └── tabla1_20240815_133045.csv
  │   └── tabla2/
  │       └── tabla2_20240815_123045.csv
  ├── postgresql_data/
  │   └── ...
  └── mongodb_data/
      └── ...
```

## Logs

Para ver los logs de los extractores:

```bash
docker-compose logs -f mysql-extractor
docker-compose logs -f postgresql-extractor
docker-compose logs -f mongodb-extractor
```

## Detener los extractores

```bash
docker-compose down
``` 