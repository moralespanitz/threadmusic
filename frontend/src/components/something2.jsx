
export const buildMockUsers2 = (clientes, users, posts, songsWithArtists) => {
  const limitedClientes = clientes.slice(0, 100);
  const limitedUsers = users.slice(0, 100);
  const limitedPosts = posts.slice(0, 300);

  const getRandomSong = () => {
    const index = Math.floor(Math.random() * songsWithArtists.length);
    return songsWithArtists[index];
  };

  const assignRandomPosts = (posts, maxPosts = 7) => {
    const numberOfPosts = Math.max(1, Math.floor(Math.random() * (maxPosts + 1)));
    const assignedPosts = [];
    const postsCopy = [...posts];

    for (let i = 0; i < numberOfPosts; i++) {
      if (postsCopy.length === 0) {
        const randomIndex = Math.floor(Math.random() * posts.length);
        const post = posts[randomIndex];
        if (post) assignedPosts.push(post);
      } else {
        const randomIndex = Math.floor(Math.random() * postsCopy.length);
        const post = postsCopy[randomIndex];
        if (post) {
          assignedPosts.push(post);
          postsCopy.splice(randomIndex, 1);
        }
      }
    }
    return assignedPosts;
  };

  const result = [];

  limitedClientes.forEach((cliente) => {
    const targetName = `${cliente.nombre}_${cliente.apellido}`.toLowerCase();

    const matchedUser = limitedUsers.find(u => {
      const username = u.usuario.toLowerCase();
      return username === targetName || username.startsWith(`${targetName}_`);
    });

    if (!matchedUser) {
      console.warn(`No se encontró usuario para cliente: ${cliente.nombre} ${cliente.apellido}`);
      return;
    }

    const userPosts = assignRandomPosts(limitedPosts);

    const finalUser = {
      id: matchedUser.id,
      username: matchedUser.usuario,
      correo: matchedUser.correo,
      displayName: `${cliente.nombre} ${cliente.apellido}`,
      avatar: `https://api.dicebear.com/7.x/thumbs/svg?seed=${matchedUser.usuario}`,
      followers: Math.floor(Math.random() * 500),
      following: Math.floor(Math.random() * 300),
      posts: userPosts
        .filter(post => post && post.content)
        .map((post, index) => ({
          id: `${matchedUser.id}-post${index}`,
          user: {
            username: matchedUser.usuario,
            displayName: `${cliente.nombre} ${cliente.apellido}`,
          },
          caption: post.content,
          timestamp: post.createdAt,
          comments: [],
          song: getRandomSong(),
        })),
    };

    result.push(finalUser);
  });

  return result;
};
