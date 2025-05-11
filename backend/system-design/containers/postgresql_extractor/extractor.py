import psycopg2
import pandas as pd
import os
import boto3
from dotenv import load_dotenv

load_dotenv()

# --- Configuración de la conexión a PostgreSQL ---
PG_HOST = os.environ.get("POSTGRES_HOST")
PG_USER = os.environ.get("POSTGRES_USER")
PG_PASSWORD = os.environ.get("POSTGRES_PASSWORD")
PG_DATABASE = os.environ.get("POSTGRES_DB")

# --- Configuración de S3 ---
S3_BUCKET_NAME = os.environ.get("S3_BUCKET_NAME")
S3_PREFIX = os.environ.get("S3_PREFIX")
OUTPUT_DIR = "./output"

def extraer_y_cargar_postgresql():
    conn = None
    try:
        conn = psycopg2.connect(
            host=PG_HOST,
            user=PG_USER,
            password=PG_PASSWORD,
            database=PG_DATABASE
        )
        cursor = conn.cursor()

        cursor.execute("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'")
        tables = [table[0] for table in cursor.fetchall()]

        s3_client = boto3.client('s3')

        for table_name in tables:
            print(f"Extrayendo datos de la tabla: {table_name}")
            query = f"SELECT * FROM {table_name}"
            cursor.execute(query)
            results = cursor.fetchall()
            columns = [desc[0] for desc in cursor.description]
            df = pd.DataFrame(results, columns=columns)

            output_file = os.path.join(OUTPUT_DIR, f"{table_name}.csv")
            df.to_csv(output_file, index=False, encoding='utf-8')
            print(f"Guardado localmente en: {output_file}")

            # --- Cargar a S3 ---
            s3_key = f"{S3_PREFIX}/{table_name}.csv"
            try:
                s3_client.upload_file(output_file, S3_BUCKET_NAME, s3_key)
                print(f"Cargado a s3://{S3_BUCKET_NAME}/{s3_key}")
                os.remove(output_file) # Opcional: Eliminar el archivo local
                print(f"Archivo local {output_file} eliminado.")
            except Exception as e:
                print(f"Error al cargar {output_file} a S3: {e}")

        conn.commit()

    except psycopg2.Error as e:
        print(f"Error al conectar o extraer datos de PostgreSQL: {e}")
        if conn:
            conn.rollback()
    finally:
        if conn:
            cursor.close()
            conn.close()
            print("Conexión a PostgreSQL cerrada.")

if __name__ == "__main__":
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    extraer_y_cargar_postgresql()
    print("Proceso de extracción y carga de PostgreSQL completado.")