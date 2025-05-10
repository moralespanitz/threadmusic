import mysql.connector
import pandas as pd
import os
import boto3

# --- Configuración de la conexión a MySQL ---
MYSQL_HOST = os.environ.get("MYSQL_HOST", "your_mysql_host")
MYSQL_USER = os.environ.get("MYSQL_USER", "your_mysql_user")
MYSQL_PASSWORD = os.environ.get("MYSQL_PASSWORD", "your_mysql_password")
MYSQL_DATABASE = os.environ.get("MYSQL_DATABASE", "your_mysql_database")

# --- Configuración de S3 ---
S3_BUCKET_NAME = os.environ.get("S3_BUCKET_NAME", "your-s3-bucket-name")
S3_PREFIX = os.environ.get("S3_PREFIX", "ingesta/mysql")
OUTPUT_DIR = "/data/output"  # Directorio local dentro del contenedor

def extraer_y_cargar_mysql():
    try:
        mydb = mysql.connector.connect(
            host=MYSQL_HOST,
            user=MYSQL_USER,
            password=MYSQL_PASSWORD,
            database=MYSQL_DATABASE
        )
        cursor = mydb.cursor()

        cursor.execute("SHOW TABLES")
        tables = [table[0] for table in cursor.fetchall()]

        s3_client = boto3.client('s3')

        for table_name in tables:
            print(f"Extrayendo datos de la tabla: {table_name}")
            query = f"SELECT * FROM {table_name}"
            cursor.execute(query)
            results = cursor.fetchall()
            columns = [column[0] for column in cursor.description]
            df = pd.DataFrame(results, columns=columns)

            output_file = os.path.join(OUTPUT_DIR, f"{table_name}.csv")
            df.to_csv(output_file, index=False, encoding='utf-8')
            print(f"Guardado localmente en: {output_file}")

            # --- Cargar a S3 ---
            s3_key = f"{S3_PREFIX}/{table_name}.csv"
            try:
                s3_client.upload_file(output_file, S3_BUCKET_NAME, s3_key)
                print(f"Cargado a s3://{S3_BUCKET_NAME}/{s3_key}")
                os.remove(output_file) # Opcional: Eliminar el archivo local después de la carga
                print(f"Archivo local {output_file} eliminado.")
            except Exception as e:
                print(f"Error al cargar {output_file} a S3: {e}")

    except mysql.connector.Error as err:
        print(f"Error al conectar o extraer datos de MySQL: {err}")
    finally:
        if mydb and mydb.is_connected():
            cursor.close()
            mydb.close()
            print("Conexión a MySQL cerrada.")

if __name__ == "__main__":
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    extraer_y_cargar_mysql()
    print("Proceso de extracción y carga de MySQL completado.")