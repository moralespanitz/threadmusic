import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Post from '../components/Post';
import { useUser } from '@clerk/clerk-react';
import { useQuery, gql } from '@apollo/client';
import { buildMockUsers2 } from '../components/something2';

const GET_CLIENTE_BY_CORREO = gql`
  query GetClienteByEmail($correo: String!) {
    clienteByEmail(correo: $correo) {
      nombre
      apellido
      user {
        id
        correo
      }
    }
  }
`;

const GET_USERS = gql`
  query {
    users {
      id
      usuario
      correo
      contrasena
    }
  }
`;

const GET_CLIENTES = gql`
  query {
    clientes {
      nombre
      apellido
    }
  }
`;

const GET_POSTS = gql`
  query {
    posts {
      userId
      content
      createdAt
    }
  }
`;

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

const Profile = () => {
  const { username } = useParams();
  const { user, isLoaded } = useUser();
  const correo = user?.emailAddresses?.[0]?.emailAddress || null;
  const isOwnProfile = !username;

  const [mockUsers, setMockUsers] = useState([]);
  const [profileData, setProfileData] = useState(null);

  const { data: clienteData, loading: loadingCliente, error: errorCliente } = useQuery(GET_CLIENTE_BY_CORREO, {
    variables: { correo },
    skip: !isLoaded || !correo || !isOwnProfile,
  });

  const { data: usersData, loading: loadingUsers, error: errorUsers } = useQuery(GET_USERS);
  const { data: clientesData, loading: loadingClientes, error: errorClientes } = useQuery(GET_CLIENTES);
  const { data: postsData, loading: loadingPosts, error: errorPosts } = useQuery(GET_POSTS);

  const { data: songsArtistsData, loading: loadingSongsArtists, error: errorSongsArtists } = useQuery(GET_SONGS_AND_ARTISTS);

  useEffect(() => {
    if (
      !isLoaded ||
      !usersData ||
      !clientesData ||
      !postsData ||
      !songsArtistsData
    )
      return;

    // canciones con artista aleatorios
    const songsWithArtists = (songsArtistsData?.songs || []).map((song) => {
      const randomArtist =
        songsArtistsData?.artistas[
          Math.floor(Math.random() * songsArtistsData.artistas.length)
        ];
      return {
        ...song,
        artist: randomArtist ? randomArtist.nombre_artistico : 'Unknown Artist',
      };
    });

    // pasamos songsWithArtists a buildMockUsers2 para asignar canciones a posts
    const builtUsers = buildMockUsers2(clientesData.clientes, usersData.users, postsData.posts, songsWithArtists);
    setMockUsers(builtUsers);

    if (isOwnProfile && clienteData?.clienteByEmail && user?.username) {
      const fullName = `${clienteData.clienteByEmail.nombre} ${clienteData.clienteByEmail.apellido}`;
      const avatar = user.imageUrl;

      // followers/following persistentes
      const storedFollowers = sessionStorage.getItem('followers');
      const storedFollowing = sessionStorage.getItem('following');
      const finalFollowers = storedFollowers ? parseInt(storedFollowers) : Math.floor(Math.random() * 500);
      const finalFollowing = storedFollowing ? parseInt(storedFollowing) : Math.floor(Math.random() * 300);
      if (!storedFollowers) sessionStorage.setItem('followers', finalFollowers);
      if (!storedFollowing) sessionStorage.setItem('following', finalFollowing);

      const mock = builtUsers.find((u) => u.username === user.username);

      setProfileData({
        name: fullName,
        username: user.username,
        avatar,
        followers: finalFollowers,
        following: finalFollowing,
        posts: mock?.posts || [],
      });
    }

    if (!isOwnProfile && username) {
      const found = builtUsers.find((u) => u.username === username);
      if (found) setProfileData(found);
    }
  }, [
    isLoaded,
    clienteData,
    usersData,
    clientesData,
    postsData,
    songsArtistsData,
    user,
    username,
    isOwnProfile,
  ]);

  const anyLoading =
    !isLoaded ||
    loadingCliente ||
    loadingUsers ||
    loadingClientes ||
    loadingPosts ||
    loadingSongsArtists;

  if (anyLoading) {
    return <div className="text-light">Cargando perfil...</div>;
  }

  if (
    isOwnProfile &&
    (!correo || errorCliente || !clienteData?.clienteByEmail)
  ) {
    return <div className="text-light mt-5">No se encontró información del usuario.</div>;
  }
  if (
    !isOwnProfile &&
    (errorUsers || errorClientes || errorPosts || errorSongsArtists)
  ) {
    return <div className="text-light mt-5">Error cargando datos del usuario.</div>;
  }

  if (!profileData) {
    return <div className="text-light mt-5">Usuario no encontrado.</div>;
  }

  return (
    <div className="text-light" style={{ maxWidth: '600px', margin: 'auto', paddingTop: '60px' }}>
      <hr style={{ marginTop: '80px' }} />

      {/* Header */}
      <div className="d-flex align-items-center mb-4">
        <img
          src={profileData.avatar}
          alt={profileData.username}
          className="rounded-circle me-3"
          style={{ width: '80px', height: '80px', objectFit: 'cover' }}
        />
        <div>
          <h4 className="mb-1">{profileData.name || profileData.displayName}</h4>
          <div className="text-white small">
            {profileData.followers} Followers • {profileData.following} Following • {profileData.posts.length} Posts
          </div>
        </div>
      </div>
      <hr />

      {/* Posts */}
      <div className="d-flex flex-column gap-3">
        {profileData.posts.length === 0 && <p>No hay posts para mostrar.</p>}
        {profileData.posts.map((post) => (
          <Post key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default Profile;
