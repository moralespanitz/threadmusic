import pandas as pd
import numpy as np

# --- Configuration ---
num_users = 25000
num_artistas = 15000
num_clientes = 20000  # Should be <= num_users
num_songs = 50000
num_posts = 40000
num_bookmarks = 30000
num_hilos = 20000

# Ensure that the number of artistas and clientes doesn't exceed the number of users
num_artistas = min(num_artistas, num_users)
num_clientes = min(num_clientes, num_users)

# Generate User data
user_ids = np.arange(1, num_users + 1)
usuarios = [f'user_{i:05d}' for i in user_ids]  # Ensure consistent username length
correos = [f'user_{i:05d}@example.com' for i in user_ids]
contraseñas = ['password'] * num_users  # Simple password for mock data
user_df = pd.DataFrame({'Id': user_ids, 'usuario': usuarios, 'correo': correos, 'contraseña': contraseñas})

# Generate Cliente data (inheriting from User)
cliente_ids = np.random.choice(user_ids, size=num_clientes, replace=False)
nombres_cliente = [f'ClienteNombre_{i:05d}' for i in range(num_clientes)]
apellidos_cliente = [f'ClienteApellido_{i:05d}' for i in range(num_clientes)]
cliente_df = pd.DataFrame({'Id': cliente_ids, 'nombre': nombres_cliente, 'apellido': apellidos_cliente})

# Generate Artista data (inheriting from User)
artista_ids = np.random.choice(user_ids, size=num_artistas, replace=False)
nombres_artisticos = [f'Artista_{i:05d}' for i in range(num_artistas)]
generos_principales = np.random.choice(['Pop', 'Rock', 'Hip-Hop', 'Electronic', 'Jazz', 'Latin', 'Country', 'Folk'], size=num_artistas)
artista_df = pd.DataFrame({'Id': artista_ids, 'nombre_artistico': nombres_artisticos, 'genero_principal': generos_principales})

# Generate Songs data
song_ids = np.arange(1, num_songs + 1)
artista_fks_songs = np.random.choice(artista_ids, size=num_songs)
titulos = [f'Song Title {i:05d}' for i in song_ids]
generos_songs = np.random.choice(['Pop', 'Rock', 'Hip-Hop', 'Electronic', 'Jazz', 'Classical', 'Indie', 'Metal', 'R&B'], size=num_songs)
songs_df = pd.DataFrame({'id': song_ids, 'artista_id': artista_fks_songs, 'titulo': titulos, 'genero': generos_songs})

# Generate Post data
post_ids = np.arange(1, num_posts + 1)
cliente_fks_posts = np.random.choice(cliente_ids, size=num_posts)
texts = [f'This is a post number {i:05d}. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' for i in post_ids] # More realistic text
likes = np.random.randint(0, 5000, size=num_posts)
post_df = pd.DataFrame({'id': post_ids, 'cliente_id': cliente_fks_posts, 'text': texts, 'likes': likes})

# Generate Bookmarks data
bookmark_ids = np.arange(1, num_bookmarks + 1)
user_fks_bookmarks = np.random.choice(user_ids, size=num_bookmarks)
post_fks_bookmarks = np.random.choice(post_ids, size=num_bookmarks)
bookmarks_df = pd.DataFrame({'id': bookmark_ids, 'user': user_fks_bookmarks, 'post': post_fks_bookmarks})

# Generate Hilo (Thread) data
hilo_ids = np.arange(1, num_hilos + 1)
post_fks_hilos = np.random.choice(post_ids, size=num_hilos)
user_fks_hilos = np.random.choice(user_ids, size=num_hilos)
hilo_df = pd.DataFrame({'id': hilo_ids, 'post': post_fks_hilos, 'user': user_fks_hilos})

# Generate Artista_Songs relationship data
num_artista_songs_relations = min(num_artistas * num_songs, 30000) # Increased number of relations
artista_ids_as = np.random.choice(artista_ids, size=num_artista_songs_relations)
song_ids_as = np.random.choice(song_ids, size=num_artista_songs_relations)
artista_songs_df = pd.DataFrame({'artista_id': artista_ids_as, 'song_id': song_ids_as})
artista_songs_df = artista_songs_df.drop_duplicates(subset=['artista_id', 'song_id']) # Ensure unique pairs

# Generate Cliente_Artista relationship data (following)
num_cliente_artista_relations = min(num_clientes * num_artistas, 40000) # Increased number of relations
cliente_ids_ca = np.random.choice(cliente_ids, size=num_cliente_artista_relations)
artista_ids_ca = np.random.choice(artista_ids, size=num_cliente_artista_relations)
cliente_artista_df = pd.DataFrame({'cliente_id': cliente_ids_ca, 'artista_id': artista_ids_ca})
cliente_artista_df = cliente_artista_df.drop_duplicates(subset=['cliente_id', 'artista_id']) # Ensure unique pairs

# --- Save to CSV files ---
output_dir = './mock_data_large/'  # New directory for larger dataset
import os
os.makedirs(output_dir, exist_ok=True)

user_df.to_csv(f'{output_dir}User.csv', index=False)
cliente_df.to_csv(f'{output_dir}Cliente.csv', index=False)
artista_df.to_csv(f'{output_dir}Artista.csv', index=False)
songs_df.to_csv(f'{output_dir}Songs.csv', index=False)
post_df.to_csv(f'{output_dir}Post.csv', index=False)
bookmarks_df.to_csv(f'{output_dir}Bookmarks.csv', index=False)
hilo_df.to_csv(f'{output_dir}Hilo.csv', index=False)
artista_songs_df.to_csv(f'{output_dir}Artista_Songs.csv', index=False)
cliente_artista_df.to_csv(f'{output_dir}Cliente_Artista.csv', index=False)

print(f"Large mock CSV data files (minimum 20K registers for relevant tables) created successfully in '{output_dir}'")