'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('voucher_templates', [
      {
        name: JSON.stringify({
          vi: 'Website miễn phí 1 ngày',
          en: 'Free Website 1 Day',
        }),
        description: JSON.stringify({
          vi: 'Tạo website miễn phí, tồn tại 1 ngày.',
          en: 'Create a free website valid for 1 day.',
        }),
        discount_type: 'day',
        discount_value: 1,
        redeem_token_cost: 55,
        templates: JSON.stringify(['*']),
        expires_at: null,
        max_usage_per_user: null,
        total_redeem_limit: null,
        site_lifespan_days: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: JSON.stringify({
          vi: 'Website miễn phí 3 ngày',
          en: 'Free Website 3 Days',
        }),
        description: JSON.stringify({
          vi: 'Tạo website miễn phí, tồn tại 3 ngày.',
          en: 'Create a free website valid for 3 days.',
        }),
        discount_type: 'day',
        discount_value: 3,
        redeem_token_cost: 120,
        templates: JSON.stringify(['*']),
        expires_at: null,
        max_usage_per_user: null,
        total_redeem_limit: null,
        site_lifespan_days: 3,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: JSON.stringify({
          vi: 'Website miễn phí 7 ngày',
          en: 'Free Website 7 Days',
        }),
        description: JSON.stringify({
          vi: 'Tạo website miễn phí, tồn tại 7 ngày.',
          en: 'Create a free website valid for 7 days.',
        }),
        discount_type: 'day',
        discount_value: 7,
        redeem_token_cost: 250,
        templates: JSON.stringify(['*']),
        expires_at: null,
        max_usage_per_user: null,
        total_redeem_limit: null,
        site_lifespan_days: 7,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: JSON.stringify({
          vi: 'Giảm 35% toàn bộ mẫu web',
          en: '35% Off All Templates',
        }),
        description: JSON.stringify({
          vi: 'Giảm 35% khi tạo website bất kỳ.',
          en: '35% off when creating any website.',
        }),
        discount_type: 'percent',
        discount_value: 35,
        redeem_token_cost: 250,
        templates: JSON.stringify(['*']),
        expires_at: null,
        max_usage_per_user: null,
        total_redeem_limit: null,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('voucher_templates', null, {});
  },
};
