from pymongo import MongoClient
import pandas as pd
import os
import boto3
from dotenv import load_dotenv
import time
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger('mongodb_extractor')

load_dotenv()

# --- Configuración de la conexión a MongoDB ---
MONGO_URI = os.environ.get("MONGO_URI")
MONGO_DATABASE = os.environ.get("MONGO_DATABASE")

# --- Configuración de S3 ---
S3_BUCKET_NAME = os.environ.get("S3_BUCKET_NAME")
S3_PREFIX = os.environ.get("S3_PREFIX", "mongodb_data")
OUTPUT_DIR = "/data/output"

# Get extraction interval in seconds (default: 1 hour)
EXTRACTION_INTERVAL = int(os.environ.get("EXTRACTION_INTERVAL", 3600))

def extraer_y_cargar_mongodb():
    client = None
    try:
        logger.info(f"Iniciando extracción de datos desde MongoDB: {MONGO_DATABASE}")
        client = MongoClient(MONGO_URI)
        db = client[MONGO_DATABASE]

        collection_names = db.list_collection_names()
        logger.info(f"Colecciones encontradas: {len(collection_names)}")

        s3_client = boto3.client('s3',
                                aws_access_key_id=os.environ.get("AWS_ACCESS_KEY_ID"),
                                aws_secret_access_key=os.environ.get("AWS_SECRET_ACCESS_KEY"),
                                aws_session_token=os.environ.get("AWS_SESSION_TOKEN")
                                )

        for collection_name in collection_names:
            logger.info(f"Extrayendo datos de la colección: {collection_name}")
            collection = db[collection_name]
            data = list(collection.find())

            if data:
                df = pd.DataFrame(data)
                if '_id' in df.columns:
                    df = df.drop(columns=['_id'])

                # Create timestamp for the filename
                timestamp = time.strftime("%Y%m%d_%H%M%S")
                output_file = os.path.join(OUTPUT_DIR, f"{collection_name}_{timestamp}.csv")
                df.to_csv(output_file, index=False, encoding='utf-8')
                logger.info(f"Guardado localmente en: {output_file}")

                # --- Cargar a S3 ---
                s3_key = f"{S3_PREFIX}/{collection_name}/{collection_name}_{timestamp}.csv"
                try:
                    s3_client.upload_file(output_file, S3_BUCKET_NAME, s3_key)
                    logger.info(f"Cargado a s3://{S3_BUCKET_NAME}/{s3_key}")
                    os.remove(output_file) # Eliminar el archivo local
                    logger.info(f"Archivo local {output_file} eliminado.")
                except Exception as e:
                    logger.error(f"Error al cargar {output_file} a S3: {e}")
            else:
                logger.info(f"La colección {collection_name} está vacía.")

    except Exception as e:
        logger.error(f"Error al conectar o extraer datos de MongoDB: {e}")
    finally:
        if client:
            client.close()
            logger.info("Conexión a MongoDB cerrada.")

def run_continuous_extraction():
    """Run extraction in a continuous loop with specified interval"""
    while True:
        try:
            logger.info(f"Iniciando ciclo de extracción. Próxima ejecución en {EXTRACTION_INTERVAL} segundos")
            os.makedirs(OUTPUT_DIR, exist_ok=True)
            extraer_y_cargar_mongodb()
            logger.info("Proceso de extracción y carga de MongoDB completado.")
        except Exception as e:
            logger.error(f"Error en el ciclo de extracción: {e}")
        
        # Sleep until next extraction
        logger.info(f"Esperando {EXTRACTION_INTERVAL} segundos para próxima extracción...")
        time.sleep(EXTRACTION_INTERVAL)

if __name__ == "__main__":
    logger.info("Iniciando servicio de extracción de MongoDB")
    run_continuous_extraction()