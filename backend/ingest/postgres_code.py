import os
import psycopg2
from datetime import datetime, timedelta
from faker import Faker
import random
import uuid
from typing import List, Dict
import time

fake = Faker()

def generate_songs(num_songs: int) -> List[Dict]:
    """Generate fake song data."""
    genres = ['Rock', 'Pop', 'Hip Hop', 'Jazz', 'Classical', 'Electronic', 'R&B', 'Country', 'Metal', 'Folk']
    songs = []
    
    for _ in range(num_songs):
        release_date = fake.date_between(start_date='-5y', end_date='today')
        songs.append({
            'songId': str(uuid.uuid4()),
            'title': fake.catch_phrase(),
            'trackId': str(uuid.uuid4()),
            'artistId': str(uuid.uuid4()),
            'genre': random.choice(genres),
            'release_date': release_date,
            'createdAt': datetime.now(),
            'updatedAt': datetime.now()
        })
    return songs

def generate_posts(num_posts: int, song_ids: List[str]) -> List[Dict]:
    """Generate fake post data."""
    posts = []
    
    for _ in range(num_posts):
        posts.append({
            'postId': str(uuid.uuid4()),
            'userId': str(uuid.uuid4()),
            'songId': random.choice(song_ids),
            'content': fake.text(max_nb_chars=200),
            'release_date': fake.date_time_between(start_date='-1y', end_date='now'),
            'createdAt': datetime.now(),
            'updatedAt': datetime.now()
        })
    return posts

def ingest_data_to_postgres(songs_data: List[Dict], posts_data: List[Dict], batch_size: int = 1000):
    """
    Ingests song and post data into a PostgreSQL database using batch processing.

    Args:
        songs_data (list): A list of dictionaries, where each dictionary represents a song.
        posts_data (list): A list of dictionaries, where each dictionary represents a post.
        batch_size (int): Number of records to insert in each batch.
    """
    db_host = os.environ.get("POSTGRES_HOST")
    db_port = os.environ.get("POSTGRES_PORT", 5432)
    db_name = os.environ.get("POSTGRES_DB")
    db_user = os.environ.get("POSTGRES_USER")
    db_password = os.environ.get("POSTGRES_PASSWORD")

    if not all([db_host, db_name, db_user, db_password]):
        print("Error: Required PostgreSQL environment variables are not set.")
        print("Please set POSTGRES_HOST, POSTGRES_DB, POSTGRES_USER, and POSTGRES_PASSWORD.")
        return

    try:
        conn = psycopg2.connect(
            host=db_host,
            port=db_port,
            database=db_name,
            user=db_user,
            password=db_password
        )
        cursor = conn.cursor()

        # Insert songs in batches
        print(f"Inserting {len(songs_data)} songs...")
        for i in range(0, len(songs_data), batch_size):
            batch = songs_data[i:i + batch_size]
            try:
                insert_song_query = """
                    INSERT INTO songs (song_id, title, track_id, artist_id, genre, release_date, created_at, updated_at)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s);
                """
                song_data = [(
                    song['songId'],
                    song['title'],
                    song['trackId'],
                    song['artistId'],
                    song['genre'],
                    song['release_date'],
                    song['createdAt'],
                    song['updatedAt']
                ) for song in batch]
                cursor.executemany(insert_song_query, song_data)
                conn.commit()
                print(f"Inserted songs batch {i//batch_size + 1}/{(len(songs_data) + batch_size - 1)//batch_size}")
            except Exception as e:
                print(f"Error inserting songs batch {i//batch_size + 1}: {e}")
                conn.rollback()

        # Insert posts in batches
        print(f"Inserting {len(posts_data)} posts...")
        for i in range(0, len(posts_data), batch_size):
            batch = posts_data[i:i + batch_size]
            try:
                insert_post_query = """
                    INSERT INTO posts (post_id, user_id, song_id, content, release_date, created_at, updated_at)
                    VALUES (%s, %s, %s, %s, %s, %s, %s);
                """
                post_data = [(
                    post['postId'],
                    post['userId'],
                    post['songId'],
                    post['content'],
                    post['release_date'],
                    post['createdAt'],
                    post['updatedAt']
                ) for post in batch]
                cursor.executemany(insert_post_query, post_data)
                conn.commit()
                print(f"Inserted posts batch {i//batch_size + 1}/{(len(posts_data) + batch_size - 1)//batch_size}")
            except Exception as e:
                print(f"Error inserting posts batch {i//batch_size + 1}: {e}")
                conn.rollback()

        print("Data ingestion completed successfully.")

    except psycopg2.Error as e:
        print(f"Error connecting to or interacting with the database: {e}")
        if 'conn' in locals():
            conn.rollback()
    finally:
        if 'cursor' in locals():
            cursor.close()
        if 'conn' in locals():
            conn.close()

if __name__ == "__main__":
    # Generate 20K songs and 40K posts
    print("Generating fake data...")
    start_time = time.time()
    
    songs_data = generate_songs(20000)
    posts_data = generate_posts(40000, [song['songId'] for song in songs_data])
    
    generation_time = time.time() - start_time
    print(f"Data generation completed in {generation_time:.2f} seconds")
    
    # Ingest the data
    ingest_data_to_postgres(songs_data, posts_data)
