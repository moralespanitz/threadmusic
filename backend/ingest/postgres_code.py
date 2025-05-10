import os
import psycopg2
from datetime import datetime

def ingest_data_to_postgres(songs_data, posts_data):
    """
    Ingests song and post data into a PostgreSQL database.

    Args:
        songs_data (list): A list of dictionaries, where each dictionary represents a song.
        posts_data (list): A list of dictionaries, where each dictionary represents a post.
    """
    # Get database connection details from environment variables
    db_host = os.environ.get("POSTGRES_HOST")
    db_port = os.environ.get("POSTGRES_PORT", 5432)  # Default port is 5432
    db_name = os.environ.get("POSTGRES_DB")
    db_user = os.environ.get("POSTGRES_USER")
    db_password = os.environ.get("POSTGRES_PASSWORD")

    # Check if required environment variables are set
    if not all([db_host, db_name, db_user, db_password]):
        print("Error: Required PostgreSQL environment variables are not set.")
        print("Please set POSTGRES_HOST, POSTGRES_DB, POSTGRES_USER, and POSTGRES_PASSWORD.")
        return

    try:
        # Establish a connection to the PostgreSQL database
        conn = psycopg2.connect(
            host=db_host,
            port=db_port,
            database=db_name,
            user=db_user,
            password=db_password
        )
        cursor = conn.cursor()

        # Insert songs
        for song in songs_data:
            try:
                insert_song_query = """
                    INSERT INTO song (title, artist, album, duration, release_date, genre, created_at)
                    VALUES (%s, %s, %s, %s, %s, %s, %s);
                """
                # Ensure release_date is a date object, and created_at is a datetime object.
                release_date = datetime.strptime(song['release_date'], '%Y-%m-%d').date()
                created_at = datetime.now()
                song_data = (
                    song['title'], song['artist'], song['album'], song['duration'],
                    release_date, song['genre'], created_at
                )
                cursor.execute(insert_song_query, song_data)
                print(f"Inserted song: {song['title']}")
            except Exception as e:
                print(f"Error inserting song {song.get('title', 'Unknown')}: {e}")
                conn.rollback()  # Rollback the transaction on error, so other inserts are not affected

        # Insert posts
        for post in posts_data:
            try:
                insert_post_query = """
                    INSERT INTO post (content, user_id, song_id, created_at)
                    VALUES (%s, %s, %s, %s);
                """
                created_at = datetime.now()
                post_data = (post['content'], post['user_id'], post['song_id'], created_at)
                cursor.execute(insert_post_query, post_data)
                print(f"Inserted post: {post['content']}")
            except Exception as e:
                print(f"Error inserting post {post.get('content', 'Unknown')}: {e}")
                conn.rollback() # Rollback the transaction on error

        # Commit the changes to the database
        conn.commit()

        print("Data ingestion completed successfully.")

    except psycopg2.Error as e:
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
    songs_data = [
        {
            'title': 'Summer Vibes',
            'artist': 'John Doe',
            'album': 'Seasonal Sounds',
            'duration': 240,
            'release_date': '2023-06-15',
            'genre': 'Electronic'
        },
        {
            'title': 'Autumn Leaves',
            'artist': 'Jane Smith',
            'album': 'Seasonal Sounds',
            'duration': 195,
            'release_date': '2023-09-22',
            'genre': 'Jazz'
        }
    ]
    posts_data = [
        {
            'content': 'Check out this amazing new track!',
            'user_id': 'user123',
            'song_id': 1
        },
        {
            'content': 'My latest composition is now available',
            'user_id': 'user456',
            'song_id': 2
        }
    ]

    # Set your PostgreSQL environment variables (replace with your actual values)
    os.environ["POSTGRES_HOST"] = "your_host"
    os.environ["POSTGRES_PORT"] = "5432"  # Or your port if it's not the default
    os.environ["POSTGRES_DB"] = "your_database_name"
    os.environ["POSTGRES_USER"] = "your_user"
    os.environ["POSTGRES_PASSWORD"] = "your_password"

    # Call the function to ingest the data
    ingest_data_to_postgres(songs_data, posts_data)
