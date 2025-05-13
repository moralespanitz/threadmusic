import React from 'react';
import { useParams } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import Post from '../components/Post';
import mockUsers from '../components/something';

const Profile = () => {
  const { username } = useParams();
  const { user, isLoaded } = useUser();

  if (!isLoaded) return <div className="text-light">Cargando perfil...</div>;

  // Si estamos en nuestro propio perfil (/profile)
  const isOwnProfile = !username;

  // Usuario a mostrar (mocked)
  const profileData = isOwnProfile
    ? {
        name: user.fullName,
        username: user.username,
        avatar: user.imageUrl,
        followers: 99,
        following: 42,
        posts: [], // Puedes mapear a partir del usuario real si lo tienes
      }
    : mockUsers[username];

  if (!profileData) {
    return <div className="text-light mt-5">Usuario no encontrado.</div>;
  }

  return (
    <div className="text-light">
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
          <h4 className="mb-1">{profileData.name}</h4>
          <div className="text-white small">
            {profileData.followers} Followers • {profileData.following} Following • {profileData.posts.length} Posts
          </div>
        </div>
      </div>
      <hr></hr>
      {/* Posts */}
      <div className="d-flex flex-column gap-3">
        {profileData.posts.map((post) => (
          <Post key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default Profile;
