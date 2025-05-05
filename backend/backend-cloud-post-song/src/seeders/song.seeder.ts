import 'dotenv/config';
import { DataSource } from 'typeorm';
import { Song } from 'src/song/entities/song.entity';
import { Post } from 'src/post/entities/post.entity';

async function run() {

    const ds = new DataSource({
        type: 'postgres',
        host: process.env.POSTGRES_HOST,
        port: 5432,
        username: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        database: process.env.POSTGRES_DB,
        entities: [Song, Post],
        synchronize: false,
    });

    await ds.initialize();

    const songRepo = ds.getRepository(Song);
    const postRepo = ds.getRepository(Post);
    await postRepo.clear();
    await songRepo.createQueryBuilder()
    .delete()
    .execute();
      ;
    

    const seedSongs: Partial<Song>[] = [
        { title: 'Blinding Lights', artistId: '1', genre: 'Pop', release_date: new Date('2019-11-29') },
        { title: 'Shape of You', artistId: '2', genre: 'Pop', release_date: new Date('2017-01-06') },
        { title: 'Levitating', artistId: '3', genre: 'Pop', release_date: new Date('2020-03-27') },
        { title: 'Save Your Tears', artistId: '1', genre: 'Pop', release_date: new Date('2020-08-09') },
        { title: 'Sunflower', artistId: '4', genre: 'Hip-Hop', release_date: new Date('2018-10-19') },
        { title: 'Rockstar', artistId: '5', genre: 'Hip-Hop', release_date: new Date('2017-05-18') },
        { title: 'Old Town Road', artistId: '6', genre: 'Country Rap', release_date: new Date('2019-12-03') },
        { title: 'Watermelon Sugar', artistId: '7', genre: 'Pop', release_date: new Date('2020-05-15') },
        { title: 'Bad Guy', artistId: '8', genre: 'Pop', release_date: new Date('2019-03-29') },
        { title: 'Happier Than Ever', artistId: '9', genre: 'Pop', release_date: new Date('2021-07-30') },
        { title: 'Good 4 U', artistId: '10', genre: 'Pop Punk', release_date: new Date('2021-05-14') },
        { title: 'Industry Baby', artistId: '11', genre: 'Hip-Hop', release_date: new Date('2021-07-23') },
        { title: 'Peaches', artistId: '12', genre: 'R&B', release_date: new Date('2021-03-19') },
        { title: 'Montero', artistId: '13', genre: 'Pop', release_date: new Date('2021-09-17') },
        { title: 'Stay', artistId: '14', genre: 'Pop', release_date: new Date('2021-07-09') },
        { title: 'Kiss Me More', artistId: '15', genre: 'Pop', release_date: new Date('2021-04-09') },
        { title: 'Shivers', artistId: '2', genre: 'Pop', release_date: new Date('2021-09-10') },
        { title: 'Don’t Start Now', artistId: '16', genre: 'Pop', release_date: new Date('2019-10-31') },
        { title: 'Blinding Lights (Remix)', artistId: '1', genre: 'Pop', release_date: new Date('2020-08-06') },
        { title: 'Smells Like Teen Spirit', artistId: '17', genre: 'Rock', release_date: new Date('1991-09-24') }
    ];

    console.log('Insertando canciones de prueba…');
    const songs = songRepo.create(seedSongs);
    await songRepo.save(songs);

    console.log(`Seeded ${songs.length} songs.`);
    await ds.destroy();
}

run().catch(err => {
    console.error('Song seeder error:', err);
    process.exit(1);
});
