import React, { useState } from 'react';
import { Heart, Bookmark, BookmarkCheck, MessageCircle } from 'lucide-react';

const Post = ({ post, onComment, onBookmark, isComment = false }) => {
  const {
    id = 'unknown',
    user = { username: 'unknown', displayName: 'Unknown User' },
    song,
    caption = '',
    timestamp = '',
    comments = [],
  } = post || {};

  const [commentText, setCommentText] = useState('');
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  const handleComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const newComment = {
      id: Date.now(),
      user: {
        username: 'me',
        displayName: 'My Name',
      },
      song: null,
      caption: commentText,
      timestamp: 'Just now',
      comments: [],
    };

    onComment?.(id, newComment);
    setCommentText('');
    setShowCommentInput(false);
  };

  if (!post) {
    return (
      <div className="card mb-3 shadow-sm">
        <div className="card-body">
          <p>This post is unavailable</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card mb-3 shadow-sm">
      <div className="card-body">
        <div className="d-flex justify-content-between">
          <div>
            <strong>{user.displayName}</strong> @{user.username}
          </div>
          <small className="text-muted">{timestamp}</small>
        </div>

        <p className="mt-2 mb-1">{caption}</p>
        {song && (
          <div>
            <p className="mb-1">
              <strong>{song.title}</strong> – {song.artist}
            </p>
            <audio style={{ marginTop: '5px' }} controls src={song.audioUrl} className="w-100" />
          </div>
        )}
        
        {!isComment && (
          <div className="mt-3 d-flex justify-content-between align-items-center text-muted px-1">
            <span
              role="button"
              onClick={() => setLiked((prev) => !prev)}
              className="d-flex align-items-center"
            >
              <Heart
                size={22}
                style={{
                  color: liked ? 'red' : 'white',
                  fill: liked ? 'red' : 'none',
                  transition: '0.2s ease',
                  cursor: 'pointer',
                }}
              />
            </span>

            <span
              role="button"
              onClick={() => setShowCommentInput((prev) => !prev)}
              className="text-muted"
            >
              <MessageCircle size={22} style={{ cursor: 'pointer', color: 'white' }} />
            </span>

            <span
              role="button"
              onClick={() => {
                setBookmarked((prev) => !prev);
                onBookmark?.(post);
              }}
            >
              {bookmarked ? (
                <BookmarkCheck
                  size={22}
                  style={{
                    color: '#0d6efd',
                    fill: '#0d6efd',
                    transition: '0.2s ease',
                    cursor: 'pointer',
                  }}
                />
              ) : (
                <Bookmark
                  size={22}
                  style={{ color: 'white', transition: '0.2s ease', cursor: 'pointer' }}
                />
              )}
            </span>
          </div>
        )}

        {showCommentInput && (
          <form className="mt-2" onSubmit={handleComment}>
            <input
              type="text"
              className="form-control"
              placeholder="Reply..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              autoFocus
            />
          </form>
        )}

        {comments.length > 0 && (
          <div className="mt-3 ps-3 border-start">
            {comments.map((comment) => (
              <Post
                key={comment.id}
                post={comment}
                isComment={true}
                onComment={() => {}}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Post;
