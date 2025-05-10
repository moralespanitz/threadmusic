import os
import mysql.connector
from datetime import datetime
from dotenv import load_dotenv
import random
import string
from faker import Faker

load_dotenv()

def generate_random_password(length=12):
    """Generate a random password."""
    characters = string.ascii_letters + string.digits + "!@#$%^&*"
    return ''.join(random.choice(characters) for _ in range(length))

def generate_test_data(num_records=20000):
    """
    Generate test data for users, artists, and clients.
    
    Args:
        num_records (int): Number of records to generate
        
    Returns:
        tuple: (users_data, artists_data, clients_data)
    """
    fake = Faker()
    users_data = []
    artists_data = []
    clients_data = []
    
    # Music genres for artists
    genres = ['Rock', 'Pop', 'Hip Hop', 'Jazz', 'Classical', 'Electronic', 
              'R&B', 'Country', 'Metal', 'Folk', 'Blues', 'Reggae']
    
    for i in range(num_records):
        # Generate user data
        first_name = fake.first_name()
        last_name = fake.last_name()
        username = f"{first_name.lower()}_{last_name.lower()}_{i}"
        email = f"{username}@example.com"
        
        user = {
            'username': username,
            'email': email,
            'password': generate_random_password(),
            'contrasena': generate_random_password(),
            'first_name': first_name,
            'last_name': last_name
        }
        users_data.append(user)
        
        # Randomly decide if this user is an artist (30% chance)
        if random.random() < 0.3:
            artist = {
                'email': email,
                'nombre_artistico': f"{first_name} {last_name}",
                'genero_principal': random.choice(genres)
            }
            artists_data.append(artist)
        
        # Randomly decide if this user is a client (40% chance)
        if random.random() < 0.4:
            client = {
                'email': email,
                'nombre': first_name,
                'apellido': last_name
            }
            clients_data.append(client)
    
    return users_data, artists_data, clients_data

def ingest_data_to_mysql(users_data, artists_data, clients_data):
    """
    Ingests user, artist, and client data into a MySQL database.

    Args:
        users_data (list): A list of dictionaries, where each dictionary represents a CustomUser.
        artists_data (list): A list of dictionaries, where each dictionary represents an Artista.
        clients_data (list): A list of dictionaries, where each dictionary represents a Cliente.
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

        # Dictionary to store user_id mappings
        user_id_mapping = {}
        
        # Batch size for processing
        batch_size = 1000
        total_users = len(users_data)
        
        print(f"Starting to ingest {total_users} users...")
        
        # Process users in batches
        for i in range(0, total_users, batch_size):
            batch = users_data[i:i + batch_size]
            for user in batch:
                try:
                    insert_user_query = """
                        INSERT INTO users_customuser (
                            username, email, password, contrasena,
                            is_superuser, is_staff, is_active,
                            date_joined, first_name, last_name
                        )
                        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s);
                    """
                    user_data = (
                        user['username'],
                        user['email'],
                        user['password'],
                        user.get('contrasena'),
                        False,  # is_superuser
                        False,  # is_staff
                        True,   # is_active
                        datetime.now(),  # date_joined
                        user.get('first_name', ''),  # first_name
                        user.get('last_name', '')    # last_name
                    )
                    cursor.execute(insert_user_query, user_data)
                    user_id = cursor.lastrowid
                    user_id_mapping[user['email']] = user_id
                except Exception as e:
                    print(f"Error inserting user {user.get('email', 'Unknown')}: {e}")
                    conn.rollback()
            
            # Commit after each batch
            conn.commit()
            print(f"Processed {min(i + batch_size, total_users)}/{total_users} users")
        
        print("Users ingestion completed. Starting artists...")
        
        # Process artists in batches
        total_artists = len(artists_data)
        for i in range(0, total_artists, batch_size):
            batch = artists_data[i:i + batch_size]
            for artist in batch:
                try:
                    user_id = user_id_mapping.get(artist['email'])
                    if not user_id:
                        print(f"Error: No user found for artist email {artist['email']}")
                        continue

                    insert_artist_query = """
                        INSERT INTO artists_artista (user_id, nombre_artistico, genero_principal)
                        VALUES (%s, %s, %s);
                    """
                    artist_data = (user_id, artist['nombre_artistico'], artist['genero_principal'])
                    cursor.execute(insert_artist_query, artist_data)
                except Exception as e:
                    print(f"Error inserting artist {artist.get('nombre_artistico', 'Unknown')}: {e}")
                    conn.rollback()
            
            # Commit after each batch
            conn.commit()
            print(f"Processed {min(i + batch_size, total_artists)}/{total_artists} artists")
        
        print("Artists ingestion completed. Starting clients...")
        
        # Process clients in batches
        total_clients = len(clients_data)
        for i in range(0, total_clients, batch_size):
            batch = clients_data[i:i + batch_size]
            for client in batch:
                try:
                    user_id = user_id_mapping.get(client['email'])
                    if not user_id:
                        print(f"Error: No user found for client email {client['email']}")
                        continue

                    insert_client_query = """
                        INSERT INTO clients_cliente (user_id, nombre, apellido)
                        VALUES (%s, %s, %s);
                    """
                    client_data = (user_id, client['nombre'], client['apellido'])
                    cursor.execute(insert_client_query, client_data)
                except Exception as e:
                    print(f"Error inserting client {client.get('nombre', 'Unknown')}: {e}")
                    conn.rollback()
            
            # Commit after each batch
            conn.commit()
            print(f"Processed {min(i + batch_size, total_clients)}/{total_clients} clients")

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
    # Generate 20,000 records
    print("Generating test data...")
    users_data, artists_data, clients_data = generate_test_data(20000)
    
    print(f"Generated {len(users_data)} users")
    print(f"Generated {len(artists_data)} artists")
    print(f"Generated {len(clients_data)} clients")
    
    # Ingest the data
    ingest_data_to_mysql(users_data, artists_data, clients_data)
