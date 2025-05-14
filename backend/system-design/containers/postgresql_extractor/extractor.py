import psycopg2
import pandas as pd
import os
import boto3
import time
import logging
from dotenv import load_dotenv
import sys  # Importa el módulo sys para manejar excepciones más específicamente

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger('postgresql_extractor')

load_dotenv()

# --- Configuración de la conexión a PostgreSQL ---
PG_HOST = os.environ.get("POSTGRES_HOST")
PG_USER = os.environ.get("POSTGRES_USER")
PG_PASSWORD = os.environ.get("POSTGRES_PASSWORD")
PG_DATABASE = os.environ.get("POSTGRES_DB")

logger.info(f"Configuración: Host={PG_HOST}, User={PG_USER}, DB={PG_DATABASE}")

# --- Configuración de S3 ---
S3_BUCKET_NAME = os.environ.get("S3_BUCKET_NAME")
S3_PREFIX = os.environ.get("S3_PREFIX", "postgresql_data")
OUTPUT_DIR = "/data/output"

# Get extraction interval in seconds (default: 1 hour)
EXTRACTION_INTERVAL = int(os.environ.get("EXTRACTION_INTERVAL", 3600))

def extraer_y_cargar_postgresql():
    conn = None
    try:
        logger.info(f"Iniciando extracción de datos desde PostgreSQL: {PG_DATABASE}")
        conn = psycopg2.connect(
            host=PG_HOST,
            user=PG_USER,
            password=PG_PASSWORD,
            database=PG_DATABASE
        )
        cursor = conn.cursor()

        cursor.execute("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'")
        tables = [table[0] for table in cursor.fetchall()]
        logger.info(f"Tablas encontradas: {len(tables)}")

        # Intenta crear el cliente S3 una sola vez y maneja la excepción aquí
        try:
            s3_client = boto3.client('s3',
                                     aws_access_key_id=os.environ.get("AWS_ACCESS_KEY_ID"),
                                     aws_secret_access_key=os.environ.get("AWS_SECRET_ACCESS_KEY"),
                                     aws_session_token=os.environ.get("AWS_SESSION_TOKEN")
                                     )
        except Exception as e:
            logger.error(f"Error al crear el cliente S3: {e}")
            logger.error("Asegúrate de haber configurado correctamente tus credenciales de AWS.")
            sys.exit(1)  # Termina el script si no se pueden obtener las credenciales

        for table_name in tables:
            logger.info(f"Extrayendo datos de la tabla: {table_name}")
            query = f"SELECT * FROM {table_name}"
            cursor.execute(query)
            results = cursor.fetchall()
            columns = [desc[0] for desc in cursor.description]
            df = pd.DataFrame(results, columns=columns)

            # Create timestamp for the filename
            timestamp = time.strftime("%Y%m%d_%H%M%S")
            output_file = os.path.join(OUTPUT_DIR, f"{table_name}_{timestamp}.csv")
            df.to_csv(output_file, index=False, encoding='utf-8')
            logger.info(f"Guardado localmente en: {output_file}")

            # --- Cargar a S3 ---
            s3_key = f"{S3_PREFIX}/{table_name}/{table_name}_{timestamp}.csv"
            try:
                s3_client.upload_file(output_file, S3_BUCKET_NAME, s3_key)
                logger.info(f"Cargado a s3://{S3_BUCKET_NAME}/{s3_key}")
                os.remove(output_file) # Eliminar el archivo local
                logger.info(f"Archivo local {output_file} eliminado.")
            except Exception as e:
                logger.error(f"Error al cargar {output_file} a S3: {e}")
                # No uses sys.exit(1) aquí, permite que el script continue con las otras tablas
                # Considera loggear el error en un archivo o sistema de monitoreo.

        conn.commit()

    except psycopg2.Error as e:
        logger.error(f"Error al conectar o extraer datos de PostgreSQL: {e}")
        if conn:
            conn.rollback()
    finally:
        if conn:
            cursor.close()
            conn.close()
            logger.info("Conexión a PostgreSQL cerrada.")

def run_continuous_extraction():
    """Run extraction in a continuous loop with specified interval"""
    while True:
        try:
            logger.info(f"Iniciando ciclo de extracción. Próxima ejecución en {EXTRACTION_INTERVAL} segundos")
            os.makedirs(OUTPUT_DIR, exist_ok=True)
            extraer_y_cargar_postgresql()
            logger.info("Proceso de extracción y carga de PostgreSQL completado.")
        except Exception as e:
            logger.error(f"Error en el ciclo de extracción: {e}")
        
        # Sleep until next extraction
        logger.info(f"Esperando {EXTRACTION_INTERVAL} segundos para próxima extracción...")
        time.sleep(EXTRACTION_INTERVAL)

if __name__ == "__main__":
    logger.info("Iniciando servicio de extracción de PostgreSQL")
    run_continuous_extraction()
