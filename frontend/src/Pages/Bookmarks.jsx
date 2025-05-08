import React from 'react';
import { FaBookmark, FaTrashAlt, FaMusic } from 'react-icons/fa';

const bookmarkedPosts = [
  {
    id: 1,
    user: '@melomaniac',
    comment: "This track gives me chills every time 🔥",
    song: {
      title: 'Nightcall',
      artist: 'Kavinsky',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    },
    timestamp: '2 days ago',
  },
  {
    id: 2,
    user: '@vibesonly',
    comment: "This beat hits deep. Instant classic.",
    song: {
      title: 'The Less I Know The Better',
      artist: 'Tame Impala',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    },
    timestamp: '1 week ago',
  },
];

const Bookmarks = () => {
  return (
    <div style={{ color: 'white' }}>
      <h2 className="mb-4 d-flex align-items-center gap-2">
        <FaBookmark /> Your Bookmarked Posts
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
              <div className="d-flex justify-content-between mb-2 text-muted small">
                <span>{post.user}</span>
                <span>{post.timestamp}</span>
              </div>

              {/* Song with player */}
              <div
                className="mb-3 p-3 rounded"
                style={{ backgroundColor: '#292929' }}
              >
                <div className="d-flex align-items-center gap-3 mb-2">
                  <FaMusic size={24} className="text-primary" />
                  <div>
                    <h5 className="m-0 text-light">{post.song.title}</h5>
                    <div className="text-muted">{post.song.artist}</div>
                  </div>
                </div>
                <audio
                  controls
                  src={post.song.audioUrl}
                  style={{ width: '100%' }}
                >
                  Your browser does not support the audio element.
                </audio>
              </div>

              {/* Comment */}
              <p className="mb-2" style={{ color: '#ccc', fontSize: '0.95rem' }}>
                {post.comment}
              </p>

              {/* Bookmark Button */}
              <div className="d-flex justify-content-end">
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => console.log('Unbookmark post', post.id)}
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
