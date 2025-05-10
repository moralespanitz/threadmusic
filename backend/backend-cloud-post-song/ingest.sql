-- PostgreSQL

-- Insert new songs
INSERT INTO song (title, artist, album, duration, release_date, genre, created_at)
VALUES 
  ('Summer Vibes', 'John Doe', 'Seasonal Sounds', 240, '2023-06-15', 'Electronic', NOW()),
  ('Autumn Leaves', 'Jane Smith', 'Seasonal Sounds', 195, '2023-09-22', 'Jazz', NOW());

-- Insert new posts
INSERT INTO post (content, user_id, song_id, created_at)
VALUES 
  ('Check out this amazing new track!', 'user123', 1, NOW()),
  ('My latest composition is now available', 'user456', 2, NOW());