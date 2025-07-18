'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('web_configs', null, {});
    const SERVER_URL = process.env.SERVER_URL;
    await queryInterface.bulkInsert('web_configs', [
      {
        key: 'site_name',
        value: JSON.stringify({ vi: 'LoveNote', en: 'LoveNote' }),
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        key: 'description_site',
        value: JSON.stringify({
          vi: 'LoveNote là nền tảng giúp bạn dễ dàng tạo những trang web nhỏ xinh để gửi thông điệp yêu thương, lời chúc ngọt ngào hoặc món quà tinh tế đến người đặc biệt của bạn. Chỉ với vài bước đơn giản, bạn có thể chọn mẫu, viết lời nhắn và chia sẻ đến người thân, bạn bè hoặc người yêu — tạo nên những khoảnh khắc ý nghĩa và đáng nhớ.',
          en: 'LoveNote is a platform that lets you easily create personalized mini websites to send heartfelt messages, sweet wishes, or thoughtful gifts to your loved ones. With just a few simple steps, you can choose a template, write your message, and share it with your partner, family, or friends — turning everyday moments into meaningful memories.',
        }),
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        key: 'copyright',
        value: JSON.stringify({
          vi: 'Bản quyền © 2025',
          en: 'Copyright © 2025',
        }),
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        key: 'contacts',
        value: JSON.stringify({
          phone: '',
          email: 'love.note.t2t@gmail.com',
          google_map: 'https://maps.app.goo.gl/RhBnQki42gVzsdz56',
        }),
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        key: 'socials',
        value: JSON.stringify({
          facebook: 'https://fb.me/',
          instagram: '#',
        }),
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        key: 'contacts_note',
        value: JSON.stringify({
          vi: 'Nếu có vấn đề gì thắc mắc hãy liên hệ cho tôi nhe!',
          en: 'If you have any questions or concerns, please contact me!',
        }),
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        key: 'avatar_me',
        value: JSON.stringify({
          url: `${SERVER_URL}/assets/images/avatar.png`,
        }),
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        key: 'about_me',
        value: JSON.stringify({
          vi: 'Xin chào! Mình là một người yêu thích lập trình, đặc biệt là phát triển giao diện người dùng (front-end). Gần đây, mình thấy rất nhiều mẫu web được thiết kế làm quà tặng cho người thân hoặc người yêu với phong cách đẹp mắt và cảm xúc. Điều đó truyền cảm hứng để mình sưu tầm, chỉnh sửa lại các template bằng ReactJS + Tailwind CSS, đồng thời tự tay thiết kế thêm một vài mẫu độc đáo.',
          en: 'Hello! I am a programming enthusiast, especially front-end development. Recently, I have seen many web templates designed as gifts for relatives or lovers with beautiful and emotional styles. That inspired me to collect and edit templates with ReactJS + Tailwind CSS, and design a few unique templates myself.',
        }),
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        key: 'purpose_website',
        value: JSON.stringify({
          vi: 'Tại sao mình tạo ra website này? Thú thật thì... một phần là để kiếm tiền 😄. Nhưng quan trọng hơn, mình muốn tạo ra một không gian nơi mọi người có thể tự tay tạo nên những món quà kỹ thuật số — những món quà đầy tình cảm mà bạn có thể gửi đến người thân yêu dù đang ở xa. Nền tảng này cũng là nơi mình tập hợp và chỉnh sửa lại các template sưu tầm, được xây dựng lại bằng ReactJS và Tailwind CSS.',
          en: 'Why did I build this website? Well, let’s be honest — partly to make money 😄. But more importantly, I wanted to create a space where people can craft digital gifts — thoughtful, heartfelt creations you can send to your loved ones, even from afar. This platform also serves as a curated collection of templates that I’ve gathered and carefully rebuilt using ReactJS and Tailwind CSS.',
        }),
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        key: 'technology_used',
        value: JSON.stringify({
          frontend:
            '⚡ ReactJS (Vite)\n🎨 Tailwind CSS\n🚀 Responsive Design\n📦 Component-based Architecture\n',
          backend: '🧠 Node.js (Express) – REST API\n🗄️ MySQL - Database',
        }),
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        key: 'thanks',
        value: JSON.stringify({
          vi: 'Hy vọng bạn thấy trang web hữu ích và mang lại cho bạn một ý tưởng quà tặng công nghệ số tuyệt vời.',
          en: 'Hope you find the site useful and give you some great digital gift ideas.',
        }),
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        key: 'donate_note',
        value: JSON.stringify({
          vi: 'Nếu bạn muốn hỗ trợ cho trang web này, bạn có thể gửi qua đây, tôi sẽ rất cảm kích vì món quà của bạn!',
          en: 'If you want to support this website, you can send it here, I would greatly appreciate your gift!',
        }),
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        key: 'bank_donate',
        value: JSON.stringify({
          bank_name: 'TIMO',
          bank_account: '9021508805275',
          bank_holder: 'Nguyen Duc Tai',
        }),
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('web_configs', null, {});
  },
};
