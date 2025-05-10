import os
from pymongo import MongoClient
from datetime import datetime
import random
import string
from faker import Faker
from dotenv import load_dotenv

load_dotenv()

fake = Faker()

def get_mongo_client():
    """Create and return a MongoDB client."""
    mongo_uri = os.environ.get("MONGO_URI")
    if not mongo_uri:
        print("Error: MONGO_URI environment variable not set.")
        return None
    
    try:
        return MongoClient(mongo_uri)
    except Exception as e:
        print(f"An error occurred connecting to MongoDB: {e}")
        return None

def generate_random_id():
    """Generate a random ID string."""
    return ''.join(random.choices(string.ascii_letters + string.digits, k=24))

def generate_tweets(num_records):
    """Generate sample tweet records."""
    tweets = []
    for _ in range(num_records):
        tweet = {
            "tweetId": generate_random_id(),
            "userId": fake.user_name(),
            "content": fake.text(max_nb_chars=280),
            "likes": random.randint(0, 1000),
            "retweets": random.randint(0, 500),
            "timestamp": datetime.utcnow()
        }
        tweets.append(tweet)
    return tweets

def generate_bookmarks(num_records):
    """Generate sample bookmark records."""
    bookmarks = []
    for _ in range(num_records):
        bookmark = {
            "id": generate_random_id(),
            "user": fake.user_name(),
            "post": generate_random_id()
        }
        bookmarks.append(bookmark)
    return bookmarks

def generate_hilos(num_records):
    """Generate sample hilo records."""
    hilos = []
    for _ in range(num_records):
        hilo = {
            "id": generate_random_id(),
            "text": fake.text(max_nb_chars=500),
            "user": fake.user_name(),
            "post": generate_random_id(),
            "likes": random.randint(0, 1000)
        }
        hilos.append(hilo)
    return hilos

def insert_test_data(num_records=20000):
    """Insert test data into all collections."""
    client = get_mongo_client()
    if not client:
        return

    try:
        db_name = os.environ.get("MONGO_DATABASE", "historialdb")
        db = client[db_name]

        # Generate and insert tweets
        print("Generating tweets...")
        tweets = generate_tweets(num_records)
        print(f"Inserting {len(tweets)} tweets...")
        db.tweets.insert_many(tweets)
        print("Tweets inserted successfully!")

        # Generate and insert bookmarks
        print("Generating bookmarks...")
        bookmarks = generate_bookmarks(num_records)
        print(f"Inserting {len(bookmarks)} bookmarks...")
        db.bookmarks.insert_many(bookmarks)
        print("Bookmarks inserted successfully!")

        # Generate and insert hilos
        print("Generating hilos...")
        hilos = generate_hilos(num_records)
        print(f"Inserting {len(hilos)} hilos...")
        db.hilos.insert_many(hilos)
        print("Hilos inserted successfully!")

    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        client.close()

if __name__ == "__main__":
    # Insert test data
    insert_test_data(20000)