import os
from pymongo import MongoClient
from datetime import datetime

def ingest_tweet_data(tweet_data):
    """
    Ingests tweet data into a MongoDB database.

    Args:
        tweet_data (list or dict): A dictionary representing a single tweet
                                     or a list of dictionaries representing multiple tweets.
    """
    mongo_uri = os.environ.get("MONGO_URI")
    database_name = os.environ.get("MONGO_DATABASE")
    collection_name = os.environ.get("MONGO_COLLECTION", "tweets")  # Default collection name is 'tweets'

    if not mongo_uri:
        print("Error: MONGO_URI environment variable not set.")
        return
    if not database_name:
        print("Error: MONGO_DATABASE environment variable not set.")
        return

    try:
        client = MongoClient(mongo_uri)
        db = client[database_name]
        tweets_collection = db[collection_name]

        if isinstance(tweet_data, dict):
            # Insert a single document
            tweet_data['timestamp'] = datetime.utcnow()
            inserted_result = tweets_collection.insert_one(tweet_data)
            print(f"Inserted tweet with ID: {inserted_result.inserted_id}")
        elif isinstance(tweet_data, list):
            # Insert multiple documents
            for tweet in tweet_data:
                tweet['timestamp'] = datetime.utcnow()
            inserted_results = tweets_collection.insert_many(tweet_data)
            print(f"Inserted {len(inserted_results.inserted_ids)} tweets.")
        else:
            print("Error: Invalid tweet data format. Expected a dictionary or a list of dictionaries.")

    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        if 'client' in locals():
            client.close()

if __name__ == "__main__":
    # Example usage:

    # Set your environment variables (replace with your actual values)
    os.environ["MONGO_URI"] = "mongodb://username:password@host:port/"  # Replace with your MongoDB connection URI
    os.environ["MONGO_DATABASE"] = "historialdb"

    # Example of inserting a single tweet
    single_tweet = {
        "tweetId": "987654321",
        "userId": "anotheruser",
        "content": "Just finished reading a great book!",
        "likes": 5,
        "retweets": 2
    }
    ingest_tweet_data(single_tweet)

    # Example of inserting multiple tweets
    multiple_tweets = [
        {
            "tweetId": "112233445",
            "userId": "coder123",
            "content": "Working on some interesting Python code today.",
            "likes": 10,
            "retweets": 3
        },
        {
            "tweetId": "667788990",
            "userId": "traveler",
            "content": "Exploring new places! #travel",
            "likes": 15,
            "retweets": 7
        }
    ]
    ingest_tweet_data(multiple_tweets)