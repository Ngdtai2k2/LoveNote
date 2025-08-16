'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'musics',
      [
        {
          title: 'Giây Tiếp Theo (下一秒)',
          artist: 'Trương Bích Thần (张碧晨)',
          url: '/assets/musics/giay_tiep_theo.mp3',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          title: 'Họa',
          artist: 'Đặng Tử Kỳ',
          url: '/assets/musics/hoa_gem.mp3',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          title: 'River Flows in You',
          artist: 'Yiruma',
          url: '/assets/musics/river_flows_in_you.mp3',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          title: 'Like My Father',
          artist: 'Jax',
          url: '/assets/musics/like_my_father.mp3',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          title: 'Tràn bộ nhớ',
          artist: 'Dương Domic',
          url: '/assets/musics/tran_bo_nho.mp3',
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('musics', null, {});
  },
};
