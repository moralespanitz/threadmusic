-- MySQL (test database)

-- Insert new users
INSERT INTO users (username, email, password_hash, created_at)
VALUES 
  ('john_doe', 'john@example.com', 'hashed_password_here', NOW()),
  ('jane_smith', 'jane@example.com', 'hashed_password_here', NOW());

-- Insert new artists
INSERT INTO artists (name, bio, user_id, created_at)
VALUES 
  ('John Doe', 'Electronic music producer', 1, NOW()),
  ('Jane Smith', 'Jazz vocalist and composer', 2, NOW());

-- Insert new client applications
INSERT INTO clients (client_id, client_secret, redirect_uri, name)
VALUES 
  ('client123', 'secret456', 'https://app.example.com/callback', 'Mobile App'),
  ('client789', 'secret012', 'https://web.example.com/auth', 'Web App');