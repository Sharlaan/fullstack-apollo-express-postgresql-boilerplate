import { Op } from 'sequelize';

export const batchUsers = async (keys, models) => {
  const users = await models.User.findAll({
    where: {
      id: {
        [Op.in]: keys,
      },
    },
  });

  return users.map(u => u.id);
};
