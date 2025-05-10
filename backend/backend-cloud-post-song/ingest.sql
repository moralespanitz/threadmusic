-- PostgreSQL schema

-- Create songs table
CREATE TABLE IF NOT EXISTS songs (
    "songId" uuid PRIMARY KEY,
    title varchar NOT NULL,
    "trackId" varchar NOT NULL,
    "artistId" varchar NOT NULL,
    genre varchar,
    release_date timestamp with time zone,
    "createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

-- Create posts table
CREATE TABLE IF NOT EXISTS posts (
    "postId" uuid PRIMARY KEY,
    "userId" varchar NOT NULL,
    content varchar,
    release_date timestamp with time zone,
    "createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    "songId" uuid REFERENCES songs("songId")
);

-- Insert new songs
INSERT INTO songs ("songId", title, "trackId", "artistId", genre, release_date, "createdAt")
VALUES 
  (gen_random_uuid(), 'Summer Vibes', 'track1', 'artist1', 'Electronic', NOW(), NOW()),
  (gen_random_uuid(), 'Autumn Leaves', 'track2', 'artist2', 'Jazz', NOW(), NOW());

-- Insert new posts
INSERT INTO posts ("postId", "userId", content, release_date, "songId")
SELECT 
    gen_random_uuid(),
    'user123',
    'Check out this amazing new track!',
    NOW(),
    "songId"
FROM songs WHERE title = 'Summer Vibes'
UNION ALL
SELECT 
    gen_random_uuid(),
    'user456',
    'My latest composition is now available',
    NOW(),
    "songId"
FROM songs WHERE title = 'Autumn Leaves';