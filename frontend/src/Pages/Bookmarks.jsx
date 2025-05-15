import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useQuery, gql } from '@apollo/client';
import { FaBookmark, FaTrashAlt, FaMusic } from 'react-icons/fa';
import { buildMockUsers2 } from '../components/something2'; // Ajusta según tu ruta

const GET_USERS = gql`query { users { id usuario correo contrasena } }`;
const GET_CLIENTES = gql`query { clientes { nombre apellido } }`;
const GET_POSTS = gql`query { posts { userId content createdAt } }`;
const GET_SONGS_AND_ARTISTS = gql`
  query GetSongsAndArtists {
    songs {
      songId
      title
      artistId
      genre
      release_date
      createdAt
      updatedAt
    }
    artistas {
      user { id }
      nombre_artistico
    }
  }
`;

const Bookmarks = () => {
  const { user, isLoaded } = useUser();

  const { data: usersData, loading: loadingUsers } = useQuery(GET_USERS);
  const { data: clientesData, loading: loadingClientes } = useQuery(GET_CLIENTES);
  const { data: postsData, loading: loadingPosts } = useQuery(GET_POSTS);
  const { data: songsArtistsData, loading: loadingSongsArtists } = useQuery(GET_SONGS_AND_ARTISTS);

  const [bookmarkedPosts, setBookmarkedPosts] = useState([]);

  useEffect(() => {
    if (
      !loadingUsers &&
      !loadingClientes &&
      !loadingPosts &&
      !loadingSongsArtists &&
      usersData &&
      clientesData &&
      postsData &&
      songsArtistsData
    ) {
      const songsWithArtists = (songsArtistsData.songs || []).map(song => {
        const artist = songsArtistsData.artistas.find(
          a => a.user.id === song.artistId
        );
        return {
          ...song,
          artist: artist ? artist.nombre_artistico : 'Unknown Artist',
        };
      });

      const builtUsers = buildMockUsers2(
        clientesData.clientes,
        usersData.users,
        postsData.posts,
        songsWithArtists
      );

      const allPosts = builtUsers.flatMap(user => user.posts || []);
      const randomCount = Math.floor(Math.random() * 6) + 3;
      const shuffled = allPosts.sort(() => 0.5 - Math.random());
      const randomBookmarks = shuffled.slice(0, randomCount);

      setBookmarkedPosts(randomBookmarks);
    }
  }, [loadingUsers, loadingClientes, loadingPosts, loadingSongsArtists]);

  const handleRemove = (id) => {
    setBookmarkedPosts(prev => prev.filter(post => post.id !== id));
  };

  if (!isLoaded || loadingUsers || loadingClientes || loadingPosts || loadingSongsArtists) {
    return <div style={{ color: 'white' }}>Cargando bookmarks...</div>;
  }

  return (
    <div style={{ color: 'white' }}>
      <hr style={{ marginTop: '80px' }} />
      <h2 className="mb-4 d-flex align-items-center gap-2">
        <FaBookmark /> My Bookmarked Posts
      </h2>

      {bookmarkedPosts.length === 0 ? (
        <p className="text-secondary">You haven’t bookmarked any posts yet.</p>
      ) : (
        <div className="d-flex flex-column gap-4">
          {bookmarkedPosts.map((post) => (
            <div
              key={post.id}
              className="p-3 rounded"
              style={{
                backgroundColor: '#1e1e1e',
                border: '1px solid #333',
              }}
            >
              {/* Timestamp (no username) */}
              <div className="d-flex justify-content-end mb-2 small" style={{ color: '#aaa' }}>
                <span>{post.timestamp}</span>
              </div>

              {/* Song Info */}
              <div className="mb-3 p-3 rounded" style={{ backgroundColor: '#292929' }}>
                <div className="d-flex align-items-center gap-3 mb-2">
                  <FaMusic size={24} className="text-primary" />
                  <div>
                    <h5 className="m-0 text-light">{post.song?.title || 'Untitled'}</h5>
                    <div className="text-muted">{post.song?.artist || 'Unknown Artist'}</div>
                  </div>
                </div>
                <audio controls src={post.song?.audioUrl} style={{ width: '100%' }}>
                  Your browser does not support the audio element.
                </audio>
              </div>

              {/* Comment */}
              <p className="mb-2" style={{ color: '#ccc', fontSize: '0.95rem' }}>
                {post.comment}
              </p>

              {/* Remove Bookmark */}
              <div className="d-flex justify-content-end">
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => handleRemove(post.id)}
                >
                  <FaTrashAlt className="me-1" />
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Bookmarks;
