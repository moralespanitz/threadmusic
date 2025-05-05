import 'dotenv/config';
import { DataSource } from 'typeorm';
import { Post } from 'src/post/entities/post.entity';
import { Song } from 'src/song/entities/song.entity';

async function run() {

    const ds = new DataSource({
        type: 'postgres',
        host: process.env.POSTGRES_HOST,
        port: 5432,
        username: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        database: process.env.POSTGRES_DB,
        entities: [Post, Song],
        synchronize: false,
    });

    await ds.initialize();

    const postRepo = ds.getRepository(Post);
    const songRepo = ds.getRepository(Song);
 
    await postRepo.clear();
 
    const songs = await songRepo.find();
    
    const seedPosts: Partial<Post>[] = [
        { userId: 'user_1', content: 'I love this song!', songId: songs[0] },
        { userId: 'user_2', content: 'Such an amazing track.', songId: songs[1] },
        { userId: 'user_3', content: 'This song makes me feel alive.', songId: songs[2] },
        { userId: 'user_4', content: 'Perfect for a road trip!',  songId: songs[3] },
        { userId: 'user_5', content: 'I can listen to this all day.', songId: songs[4] },
        { userId: 'user_6', content: 'One of the best songs ever.', songId: songs[5] },
        { userId: 'user_7', content: 'This track is fire!', songId: songs[6] },
        { userId: 'user_8', content: 'I can’t get enough of this tune!', songId: songs[7] },
        { userId: 'user_9', content: 'The rhythm is just perfect.', songId: songs[8] },
        { userId: 'user_10', content: 'This song takes me back to the good old days.', songId: songs[9] },
        { userId: 'user_11', content: 'My go-to song for working out.', songId: songs[0] },
        { userId: 'user_12', content: 'Pure energy in this track!', songId: songs[1] },
        { userId: 'user_13', content: 'Can’t stop singing this one.', songId: songs[2] },
        { userId: 'user_14', content: 'I play this on repeat.', songId: songs[3] },
        { userId: 'user_15', content: 'The vibe of this song is unmatched.', songId: songs[4] },
        { userId: 'user_16', content: 'Such a nostalgic track.', songId: songs[5] },
        { userId: 'user_17', content: 'This one hits different.', songId: songs[6] },
        { userId: 'user_18', content: 'I can never get tired of this.', songId: songs[7] },
        { userId: 'user_19', content: 'Hands down my favorite song.', songId: songs[8] },
        { userId: 'user_20', content: 'This song always gets me in a good mood.', songId: songs[9] }
    ];

    console.log('Insertando posts de prueba…');
    const posts = postRepo.create(seedPosts);
    await postRepo.save(posts);

    console.log(`Seeded ${posts.length} posts.`);
    await ds.destroy();
}

run().catch(err => {
    console.error('Post seeder error:', err);
    process.exit(1);
});
