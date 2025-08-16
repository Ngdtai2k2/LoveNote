const paginate = require('@helpers/paginate');
const { Contacts } = require('@models');

const contactService = {
  getAll: async (req) => {
    const contacts = await paginate(Contacts, req, {
      order: [['created_at', 'DESC']],
    });

    return {
      code: 200,
      data: contacts,
    };
  },

  delete: async (req) => {
    const { id } = req.params;

    await Contacts.destroy({ where: { id } });

    return {
      code: 200,
      messageKey: 'message:delete_success',
    };
  },
};

module.exports = contactService;
