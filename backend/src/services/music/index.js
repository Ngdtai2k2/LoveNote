const { Music } = require('@models');

const musicService = {
  getAll: async () => {
    const musics = await Music.findAll({
      attributes: ['id', 'title', 'artist', 'url'],
      order: [['id', 'ASC']],
    });

    return {
      code: 200,
      data: musics,
    };
  },
};

module.exports = musicService;
