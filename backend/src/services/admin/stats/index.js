const { Op } = require('sequelize');
const { User, Transaction, UserSite, Product } = require('@models');
const { sequelize } = require('@config/connectDB');
const helpers = require('@helpers');
const transaction = require('../../../models/transaction');

const countByDateRange = (Model, where, start, end) =>
  Model.count({
    where: {
      ...where,
      created_at: { [Op.gte]: start, [Op.lte]: end },
    },
  });

const sumRevenue = (start, end) =>
  Transaction.findAll({
    where: {
      status: 'paid',
      ...(start && end
        ? { created_at: { [Op.gte]: start, [Op.lte]: end } }
        : {}),
    },
    attributes: [
      [sequelize.fn('SUM', sequelize.col('total_amount')), 'totalRevenue'],
    ],
  }).then((res) => res[0]?.get('totalRevenue') || 0);

const statsService = {
  countUsers: async (req) =>
    User.count({
      where: {
        role: 0,
        ...helpers.buildBooleanFilter('is_banned', req.query.is_banned),
      },
    }),

  revenue: async (req) => {
    const { start_date, end_date } = req.query;
    return sumRevenue(
      start_date ? new Date(start_date) : null,
      end_date ? new Date(end_date) : null
    );
  },

  countSites: async (req) =>
    UserSite.count({
      where: helpers.buildBooleanFilter('is_active', req.query.is_active),
    }),

  summary: async () => {
    const getDayRange = (date) => {
      const start = new Date(date.setHours(0, 0, 0, 0));
      const end = new Date(date.setHours(23, 59, 59, 999));
      return [start, end];
    };

    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const [todayStart, todayEnd] = getDayRange(new Date(today));
    const [yesterdayStart, yesterdayEnd] = getDayRange(new Date(yesterday));

    // Today stats
    const usersToday = await countByDateRange(
      User,
      { role: 0 },
      todayStart,
      todayEnd
    );
    const sitesToday = await countByDateRange(
      UserSite,
      {},
      todayStart,
      todayEnd
    );
    const revenueToday = await sumRevenue(todayStart, todayEnd);

    // Yesterday stats
    const usersYesterday = await countByDateRange(
      User,
      { role: 0 },
      yesterdayStart,
      yesterdayEnd
    );
    const sitesYesterday = await countByDateRange(
      UserSite,
      {},
      yesterdayStart,
      yesterdayEnd
    );

    const revenueYesterday = await sumRevenue(yesterdayStart, yesterdayEnd);
    const totalRevenue = await sumRevenue();
    const totalSites = await UserSite.count();
    const totalUsers = await User.count({ where: { role: 0 } });

    return {
      users: {
        total: totalUsers,
        today: usersToday,
        change: helpers.calcChangeStats(usersToday, usersYesterday),
      },
      sites: {
        total: totalSites,
        today: sitesToday,
        change: helpers.calcChangeStats(sitesToday, sitesYesterday),
      },
      revenue: {
        total: totalRevenue,
        today: revenueToday,
        change: helpers.calcChangeStats(revenueToday, revenueYesterday),
      },
    };
  },

  userSites: async (req) => {
    const { start, end } = req.query;
    const whereClause = {};

    if (start && end) {
      whereClause.created_at = {
        [Op.between]: [new Date(start), new Date(end)],
      };
    } else if (start) {
      whereClause.created_at = {
        [Op.gte]: new Date(start),
      };
    } else if (end) {
      whereClause.created_at = {
        [Op.lte]: new Date(end),
      };
    }

    const stats = await UserSite.findAll({
      where: whereClause,
      attributes: [
        'product_id',
        [
          UserSite.sequelize.fn('COUNT', UserSite.sequelize.col('product_id')),
          'count',
        ],
      ],
      include: [
        {
          model: Product,
          as: 'product',
          attributes: ['name'],
        },
      ],
      group: ['product_id', 'product.name'],
      order: [[UserSite.sequelize.literal('count'), 'DESC']],
    });

    return {
      code: 200,
      data: stats,
    };
  },

  transaction: async (req) => {
    const { start, end } = req.query;
    const where = {};

    if (start || end) {
      where.created_at = {};
      if (start) where.created_at[Op.gte] = new Date(start);
      if (end) where.created_at[Op.lte] = new Date(end);
    }

    const stats = await Transaction.findAll({
      where,
      attributes: [
        'status',
        [
          Transaction.sequelize.fn('COUNT', Transaction.sequelize.col('id')),
          'count',
        ],
        [
          Transaction.sequelize.fn(
            'SUM',
            Transaction.sequelize.col('total_amount')
          ),
          'total_amount',
        ],
      ],
      group: ['status'],
    });

    const totalRevenue = await Transaction.sum('total_amount', {
      where: { ...where, status: 'paid' },
    });

    return {
      code: 200,
      data: {
        stats,
        totalRevenue: totalRevenue || 0,
      },
    };
  },
};

module.exports = statsService;
