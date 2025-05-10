import { useQuery } from '@apollo/client';
import { GET_SONGS } from '../graphql/getSongs';

const SongList = () => {
  const { loading, error, data } = useQuery(GET_SONGS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <ul>
      {data.songs.map((song) => (
        <li key={song.id}>
          {song.title} - {song.artist}
        </li>
      ))}
    </ul>
  );
};

export default SongList;
