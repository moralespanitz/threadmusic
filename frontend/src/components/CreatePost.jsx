import React, { useState } from 'react';

const CreatePost = ({ onPost }) => {
  const [caption, setCaption] = useState('');
  const [search, setSearch] = useState('');
  const [selectedSong, setSelectedSong] = useState(null);

  const songList = [
    { title: "Blinding Lights", artist: "The Weeknd", audioUrl: "/songs/blinding.mp3" },
    { title: "Levitating", artist: "Dua Lipa", audioUrl: "/songs/levitating.mp3" },
  ];

  const filteredSongs = songList.filter((song) =>
    `${song.title} ${song.artist}`.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!caption || !selectedSong) return;

    const newPost = {
      id: Date.now(),
      user: {
        username: 'me',
        displayName: 'My Name',
      },
      song: selectedSong,
      caption,
      timestamp: 'Just now',
      comments: [],
    };

    onPost(newPost);
    setCaption('');
    setSearch('');
    setSelectedSong(null);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <textarea
        className="form-control mb-2"
        placeholder="What's on your mind?"
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        style={{
          backgroundColor: '#2a2a2a',
          outline: 'none',
          border: 'none',
          color: 'white',
        }}
        onFocus={(e) => e.target.style.outline = '1.5px solid #1ed760'}
        onBlur={(e) => e.target.style.outline = 'none'}
      />

      {!selectedSong && (
        <>
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Search song..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              marginTop: '10px',
              backgroundColor: '#2a2a2a',
              outline: 'none',
              border: 'none',
              color: 'white',
            }}
            onFocus={(e) => e.target.style.outline = '1.5px solid #1ed760'}
            onBlur={(e) => e.target.style.outline = 'none'}
          />

          {search && (
            <ul className="list-group mb-2" style={{ maxHeight: '150px', overflowY: 'auto' }}>
              {filteredSongs.map((song, index) => (
                <li
                  key={index}
                  className="list-group-item list-group-item-action"
                  onClick={() => {
                    setSelectedSong(song);
                    setSearch('');
                  }}
                >
                  {song.title} – {song.artist}
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      {selectedSong && (
        <div className="alert alert-dark d-flex justify-content-between align-items-center">
          <span>
            🎵 {selectedSong.title} – {selectedSong.artist}
          </span>
          <button type="button" className="btn btn-sm btn-outline-light" onClick={() => setSelectedSong(null)}>
            ✖
          </button>
        </div>
      )}

      <button type="submit" className="btn btn-primary w-100" disabled={!caption || !selectedSong}>
        Post
      </button>
    </form>
  );
};

export default CreatePost;
