import pymysql
import pandas as pd
import os
import boto3
import time
import logging
from dotenv import load_dotenv

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger('mysql_extractor')

load_dotenv()

# --- Configuración de la conexión a MySQL ---
MYSQL_HOST = os.environ.get("MYSQL_HOST")
MYSQL_USER = os.environ.get("MYSQL_USER")
MYSQL_PASSWORD = os.environ.get("MYSQL_PASSWORD")
MYSQL_DATABASE = os.environ.get("MYSQL_DATABASE")

logger.info(f"Configuración: Host={MYSQL_HOST}, User={MYSQL_USER}, DB={MYSQL_DATABASE}")

# --- Configuración de S3 ---
S3_BUCKET_NAME = os.environ.get("S3_BUCKET_NAME")
S3_PREFIX = os.environ.get("S3_PREFIX", "mysql_data")
OUTPUT_DIR = "/data/output"

# Get extraction interval in seconds (default: 1 hour)
EXTRACTION_INTERVAL = int(os.environ.get("EXTRACTION_INTERVAL", 3600))

def extraer_y_cargar_mysql():
    mydb = None
    try:
        logger.info(f"Iniciando extracción de datos desde MySQL: {MYSQL_DATABASE}")
        mydb = pymysql.connect(
            host=MYSQL_HOST,
            user=MYSQL_USER,
            password=MYSQL_PASSWORD,
            database=MYSQL_DATABASE,
            charset='utf8mb4',
            port=3307,
            cursorclass=pymysql.cursors.DictCursor
        )
        cursor = mydb.cursor()

        cursor.execute("SHOW TABLES")
        tables = [table['Tables_in_' + MYSQL_DATABASE] for table in cursor.fetchall()]
        logger.info(f"Tablas encontradas: {len(tables)}")

        s3_client = boto3.client('s3',
                                aws_access_key_id=os.environ.get("AWS_ACCESS_KEY_ID"),
                                aws_secret_access_key=os.environ.get("AWS_SECRET_ACCESS_KEY"),
                                aws_session_token=os.environ.get("AWS_SESSION_TOKEN")
                                )

        for table_name in tables:
            logger.info(f"Extrayendo datos de la tabla: {table_name}")
            query = f"SELECT * FROM {table_name}"
            cursor.execute(query)
            results = cursor.fetchall()
            df = pd.DataFrame(results)

            # Create timestamp for the filename
            timestamp = time.strftime("%Y%m%d_%H%M%S")
            output_file = os.path.join(OUTPUT_DIR, f"{table_name}_{timestamp}.csv")
            df.to_csv(output_file, index=False, encoding='utf-8')
            logger.info(f"Guardado localmente en: {output_file}")

            # --- Cargar a S3 ---
            s3_key = f"{S3_PREFIX}/{table_name}/{table_name}_{timestamp}.csv"
            try:
                if not os.path.exists(output_file):
                    logger.error(f"Error: El archivo {output_file} no existe")
                    continue
                    
                if not os.path.isfile(output_file):
                    logger.error(f"Error: {output_file} no es un archivo válido")
                    continue
                    
                # Verificar que el archivo no esté vacío
                if os.path.getsize(output_file) == 0:
                    logger.error(f"Error: El archivo {output_file} está vacío")
                    continue
                    
                # Asegurarse de que la ruta sea absoluta
                output_file_abs = os.path.abspath(output_file)
                s3_client.upload_file(output_file_abs, S3_BUCKET_NAME, s3_key)
                logger.info(f"Cargado a s3://{S3_BUCKET_NAME}/{s3_key}")
                os.remove(output_file) # Eliminar el archivo local después de la carga
                logger.info(f"Archivo local {output_file} eliminado.")
            except Exception as e:
                logger.error(f"Error al cargar {output_file} a S3: {str(e)}")
                logger.error(f"Tipo de error: {type(e)}")

    except pymysql.Error as err:
        logger.error(f"Error al conectar o extraer datos de MySQL: {err}")
    finally:
        if mydb and mydb.open:
            cursor.close()
            mydb.close()
            logger.info("Conexión a MySQL cerrada.")

def run_continuous_extraction():
    """Run extraction in a continuous loop with specified interval"""
    while True:
        try:
            logger.info(f"Iniciando ciclo de extracción. Próxima ejecución en {EXTRACTION_INTERVAL} segundos")
            os.makedirs(OUTPUT_DIR, exist_ok=True)
            extraer_y_cargar_mysql()
            logger.info("Proceso de extracción y carga de MySQL completado.")
        except Exception as e:
            logger.error(f"Error en el ciclo de extracción: {e}")
        
        # Sleep until next extraction
        logger.info(f"Esperando {EXTRACTION_INTERVAL} segundos para próxima extracción...")
        time.sleep(EXTRACTION_INTERVAL)

if __name__ == "__main__":
    logger.info("Iniciando servicio de extracción de MySQL")
    run_continuous_extraction()