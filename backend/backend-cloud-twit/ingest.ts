// MongoDB (historialdb)
use historialdb

// Insert a single tweet
db.tweets.insertOne({
  tweetId: "123456789",
  userId: "user123",
  content: "This is a great new song! #music",
  timestamp: new Date(),
  likes: 0,
  retweets: 0
})

// Insert multiple tweets
db.tweets.insertMany([
  {
    tweetId: "123456790",
    userId: "user456",
    content: "Just released my new album! Check it out #newmusic",
    timestamp: new Date(),
    likes: 0,
    retweets: 0
  },
  {
    tweetId: "123456791",
    userId: "user789",
    content: "Listening to the latest release from @artist #trending",
    timestamp: new Date(),
    likes: 0,
    retweets: 0
  }
])