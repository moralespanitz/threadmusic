import React from 'react';
import { useParams } from 'react-router-dom';
import Post from '../components/Post';

const mockUsers = {
  '1': {
    id: '1',
    name: 'John Doe',
    avatar: 'https://i.pravatar.cc/150?img=1',
    followers: 128,
    following: 87,
    posts: [
      { id: 'p1', userId: '1', content: 'My first song!', song: 'song1.mp3', comments: [] },
      { id: 'p2', userId: '1', content: 'Loving this track!', song: 'song2.mp3', comments: [] },
    ],
  },
  '2': {
    id: '2',
    name: 'Jane Smith',
    avatar: 'https://i.pravatar.cc/150?img=2',
    followers: 240,
    following: 103,
    posts: [
      { id: 'p3', userId: '2', content: 'Check this out!', song: 'song3.mp3', comments: [] },
    ],
  },
};

const Profile = () => {
  const { userId } = useParams();
  const currentUserId = '1';
  const user = mockUsers[userId] || mockUsers[currentUserId];

  return (
    <div className="text-light">
      {/* Header */}
      <div className="d-flex align-items-center mb-4">
        <img
          src={user.avatar}
          alt={user.name}
          className="rounded-circle me-3"
          style={{ width: '80px', height: '80px', objectFit: 'cover' }}
        />
        <div>
          <h4 className="mb-1">{user.name}</h4>
          <div className="text-white small">
            {user.followers} Followers • {user.following} Following • {user.posts.length} Posts
          </div>
        </div>
      </div>

      {/* Posts */}
      <div className="d-flex flex-column gap-3">
        {user.posts.map((post) => (
          <Post key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default Profile;
