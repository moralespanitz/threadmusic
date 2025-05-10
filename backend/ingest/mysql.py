import os
import mysql.connector
from datetime import datetime

def ingest_data_to_mysql(users_data, artists_data, clients_data):
    """
    Ingests user, artist, and client data into a MySQL database.

    Args:
        users_data (list): A list of dictionaries, where each dictionary represents a user.
        artists_data (list): A list of dictionaries, where each dictionary represents an artist.
        clients_data (list): A list of dictionaries, where each dictionary represents a client.
    """
    # Get database connection details from environment variables
    db_host = os.environ.get("MYSQL_HOST")
    db_port = os.environ.get("MYSQL_PORT", 3306)  # Default port is 3306
    db_user = os.environ.get("MYSQL_USER")
    db_password = os.environ.get("MYSQL_PASSWORD")
    db_name = os.environ.get("MYSQL_DB")

    # Check if required environment variables are set
    if not all([db_host, db_user, db_password, db_name]):
        print("Error: Required MySQL environment variables are not set.")
        print("Please set MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, and MYSQL_DB.")
        return

    try:
        # Establish a connection to the MySQL database
        conn = mysql.connector.connect(
            host=db_host,
            port=db_port,
            user=db_user,
            password=db_password,
            database=db_name
        )
        cursor = conn.cursor()

        # Insert users
        for user in users_data:
            try:
                insert_user_query = """
                    INSERT INTO users (username, email, password_hash, created_at)
                    VALUES (%s, %s, %s, %s);
                """
                created_at = datetime.now()
                user_data = (user['username'], user['email'], user['password_hash'], created_at)
                cursor.execute(insert_user_query, user_data)
                print(f"Inserted user: {user['username']}")
            except Exception as e:
                print(f"Error inserting user {user.get('username', 'Unknown')}: {e}")
                conn.rollback()

        # Insert artists
        for artist in artists_data:
            try:
                insert_artist_query = """
                    INSERT INTO artists (name, bio, user_id, created_at)
                    VALUES (%s, %s, %s, %s);
                """
                created_at = datetime.now()
                artist_data = (artist['name'], artist['bio'], artist['user_id'], created_at)
                cursor.execute(insert_artist_query, artist_data)
                print(f"Inserted artist: {artist['name']}")
            except Exception as e:
                print(f"Error inserting artist {artist.get('name', 'Unknown')}: {e}")
                conn.rollback()

        # Insert client applications
        for client in clients_data:
            try:
                insert_client_query = """
                    INSERT INTO clients (client_id, client_secret, redirect_uri, name)
                    VALUES (%s, %s, %s, %s);
                """
                client_data = (client['client_id'], client['client_secret'], client['redirect_uri'], client['name'])
                cursor.execute(insert_client_query, client_data)
                print(f"Inserted client: {client['name']}")
            except Exception as e:
                print(f"Error inserting client {client.get('name', 'Unknown')}: {e}")
                conn.rollback()

        # Commit the changes to the database
        conn.commit()
        print("Data ingestion completed successfully.")

    except mysql.connector.Error as e:
        print(f"Error connecting to or interacting with the database: {e}")
        if 'conn' in locals():
            conn.rollback()
    finally:
        # Close the database connection
        if 'cursor' in locals():
            cursor.close()
        if 'conn' in locals():
            conn.close()

if __name__ == "__main__":
    # Example data (replace with your actual data)
    users_data = [
        {
            'username': 'john_doe',
            'email': 'john@example.com',
            'password_hash': 'hashed_password_here'
        },
        {
            'username': 'jane_smith',
            'email': 'jane@example.com',
            'password_hash': 'hashed_password_here'
        }
    ]
    artists_data = [
        {
            'name': 'John Doe',
            'bio': 'Electronic music producer',
            'user_id': 1
        },
        {
            'name': 'Jane Smith',
            'bio': 'Jazz vocalist and composer',
            'user_id': 2
        }
    ]
    clients_data = [
        {
            'client_id': 'client123',
            'client_secret': 'secret456',
            'redirect_uri': 'https://app.example.com/callback',
            'name': 'Mobile App'
        },
        {
            'client_id': 'client789',
            'client_secret': 'secret012',
            'redirect_uri': 'https://web.example.com/auth',
            'name': 'Web App'
        }
    ]

    # Set your MySQL environment variables (replace with your actual values)
    os.environ["MYSQL_HOST"] = "your_host"
    os.environ["MYSQL_PORT"] = "3306"  # Or your port if it's not the default
    os.environ["MYSQL_USER"] = "your_user"
    os.environ["MYSQL_PASSWORD"] = "your_password"
    os.environ["MYSQL_DB"] = "your_database_name"

    # Call the function to ingest the data
    ingest_data_to_mysql(users_data, artists_data, clients_data)
