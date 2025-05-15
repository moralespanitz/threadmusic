import React, { useEffect, useState } from 'react';
import Post from '../components/Post';
import CreatePost from '../components/CreatePost';
import { useUser } from '@clerk/clerk-react';

import { useQuery, gql } from '@apollo/client';
import { buildMockUsers2 } from '../components/something2';

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

const Home = () => {
  const { user, isLoaded } = useUser();

  const { data: usersData, loading: loadingUsers } = useQuery(GET_USERS);
  const { data: clientesData, loading: loadingClientes } = useQuery(GET_CLIENTES);
  const { data: postsData, loading: loadingPosts } = useQuery(GET_POSTS);
  const { data: songsArtistsData, loading: loadingSongsArtists } = useQuery(GET_SONGS_AND_ARTISTS);

  const [posts, setPosts] = useState([]);

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
      // armar canciones con artista
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

      const allPosts = builtUsers.flatMap(u => u.posts);
      const sortedPosts = allPosts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      setPosts(sortedPosts.slice(0, 15));
    }
  }, [loadingUsers, loadingClientes, loadingPosts, loadingSongsArtists, usersData, clientesData, postsData, songsArtistsData]);

  const handleNewPost = (newPost) => {
    setPosts([newPost, ...posts]);
    
    const stored = JSON.parse(sessionStorage.getItem('userPosts') || '[]');
    sessionStorage.setItem('userPosts', JSON.stringify([newPost, ...stored]));
  };

  const handleComment = (postId, comment) => {
    const addComment = (postList) =>
      postList.map((p) =>
        p.id === postId
          ? { ...p, comments: [...(p.comments || []), comment] }
          : { ...p, comments: addComment(p.comments || []) }
      );
    setPosts((prev) => addComment(prev));
  };

  if (!isLoaded || loadingUsers || loadingClientes || loadingPosts || loadingSongsArtists) {
    return <div>Cargando posts...</div>;
  }

  return (
    <div>
      <hr style={{ marginTop: '80px' }} />
      <h2>Hello {user.fullName}</h2>
      <hr />
      <CreatePost onPost={handleNewPost} />
      <hr />
      {posts.length === 0 && <p>No hay posts para mostrar.</p>}
      {posts.map(post => (
        <Post
          key={post.id}
          post={post}
          onComment={handleComment}
        />
      ))}
    </div>
  );
};

export default Home;
