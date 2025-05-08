import React, { useState } from 'react';
import Post from '../components/Post';
import CreatePost from '../components/CreatePost';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);

  const handleNewPost = (newPost) => {
    setPosts([newPost, ...posts]);
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

  const handleBookmark = (post) => {
    // Avoid duplicates
    if (!bookmarks.find((b) => b.id === post.id)) {
      setBookmarks([...bookmarks, post]);
    }
  };

  return (
    <div>
      <hr></hr>
      <CreatePost onPost={handleNewPost} />
      <hr />
      {posts.map((post) => (
        <Post
          key={post.id}
          post={post}
          onComment={handleComment}
          onBookmark={handleBookmark}
        />
      ))}
    </div>
  );
};

export default Home;
