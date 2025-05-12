import pymysql
import pandas as pd
import os
import boto3
from dotenv import load_dotenv

load_dotenv()

# --- Configuración de la conexión a MySQL ---
MYSQL_HOST = os.environ.get("MYSQL_HOST")
MYSQL_USER = os.environ.get("MYSQL_USER")
MYSQL_PASSWORD = os.environ.get("MYSQL_PASSWORD")
MYSQL_DATABASE = os.environ.get("MYSQL_DATABASE")

print(MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE)
# --- Configuración de S3 ---
S3_BUCKET_NAME = os.environ.get("S3_BUCKET_NAME")
S3_PREFIX = os.environ.get("S3_PREFIX")
OUTPUT_DIR = "./output"

def extraer_y_cargar_mysql():
    mydb = None
    try:
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

        s3_client = boto3.client('s3',
                                aws_access_key_id=os.environ.get("AWS_ACCESS_KEY_ID"),
                                aws_secret_access_key=os.environ.get("AWS_SECRET_ACCESS_KEY"),
                                aws_session_token=os.environ.get("AWS_SESSION_TOKEN")
                                )

        for table_name in tables:
            print(f"Extrayendo datos de la tabla: {table_name}")
            query = f"SELECT * FROM {table_name}"
            cursor.execute(query)
            results = cursor.fetchall()
            df = pd.DataFrame(results)

            output_file = os.path.join(OUTPUT_DIR, f"{table_name}.csv")
            df.to_csv(output_file, index=False, encoding='utf-8')
            print(f"Guardado localmente en: {output_file}")

            # --- Cargar a S3 ---
            s3_key = f"{S3_PREFIX}/{table_name}.csv"
            try:
                if not os.path.exists(output_file):
                    print(f"Error: El archivo {output_file} no existe")
                    continue
                    
                if not os.path.isfile(output_file):
                    print(f"Error: {output_file} no es un archivo válido")
                    continue
                    
                # Verificar que el archivo no esté vacío
                if os.path.getsize(output_file) == 0:
                    print(f"Error: El archivo {output_file} está vacío")
                    continue
                    
                # Asegurarse de que la ruta sea absoluta
                output_file_abs = os.path.abspath(output_file)
                s3_client.upload_file(output_file_abs, S3_BUCKET_NAME, s3_key)
                print(f"Cargado a s3://{S3_BUCKET_NAME}/{s3_key}")
                os.remove(output_file) # Opcional: Eliminar el archivo local después de la carga
                print(f"Archivo local {output_file} eliminado.")
            except Exception as e:
                print(f"Error al cargar {output_file} a S3: {str(e)}")
                print(f"Tipo de error: {type(e)}")

    except pymysql.Error as err:
        print(f"Error al conectar o extraer datos de MySQL: {err}")
    finally:
        if mydb and mydb.open:
            cursor.close()
            mydb.close()
            print("Conexión a MySQL cerrada.")

if __name__ == "__main__":
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    extraer_y_cargar_mysql()
    print("Proceso de extracción y carga de MySQL completado.")