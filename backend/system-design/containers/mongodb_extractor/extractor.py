from pymongo import MongoClient
import pandas as pd
import os
# import boto3
from dotenv import load_dotenv

load_dotenv()

# --- Configuración de la conexión a MongoDB ---
MONGO_URI = os.environ.get("MONGO_URI")
MONGO_DATABASE = os.environ.get("MONGO_DATABASE")

# # --- Configuración de S3 ---
# S3_BUCKET_NAME = os.environ.get("S3_BUCKET_NAME", "your-s3-bucket-name")
# S3_PREFIX = os.environ.get("S3_PREFIX", "ingesta/mongodb")
OUTPUT_DIR = "./output"

def extraer_y_cargar_mongodb():
    client = None
    try:
        client = MongoClient(MONGO_URI)
        db = client[MONGO_DATABASE]

        collection_names = db.list_collection_names()

        # s3_client = boto3.client('s3')

        for collection_name in collection_names:
            print(f"Extrayendo datos de la colección: {collection_name}")
            collection = db[collection_name]
            data = list(collection.find())

            if data:
                df = pd.DataFrame(data)
                if '_id' in df.columns:
                    df = df.drop(columns=['_id'])

                output_file = os.path.join(OUTPUT_DIR, f"{collection_name}.csv")
                df.to_csv(output_file, index=False, encoding='utf-8')
                print(f"Guardado localmente en: {output_file}")

                # # --- Cargar a S3 ---
                # s3_key = f"{S3_PREFIX}/{collection_name}.csv"
                # try:
                #     s3_client.upload_file(output_file, S3_BUCKET_NAME, s3_key)
                #     print(f"Cargado a s3://{S3_BUCKET_NAME}/{s3_key}")
                #     os.remove(output_file) # Opcional: Eliminar el archivo local
                #     print(f"Archivo local {output_file} eliminado.")
                # except Exception as e:
                #     print(f"Error al cargar {output_file} a S3: {e}")
            else:
                print(f"La colección {collection_name} está vacía.")

    except Exception as e:
        print(f"Error al conectar o extraer datos de MongoDB: {e}")
    finally:
        if client:
            client.close()
            print("Conexión a MongoDB cerrada.")

if __name__ == "__main__":
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    extraer_y_cargar_mongodb()
    print("Proceso de extracción y carga de MongoDB completado.")