export default async function createUsersWithMessages(date, models) {
  const createdAt = date.setSeconds(date.getSeconds() + 1);

  const newUsers = [
    {
      username: 'rwieruch',
      email: 'hello@robin.com',
      password: 'rwieruch',
      role: 'ADMIN',
      messages: [
        {
          text: 'Published the Road to learn React',
          createdAt,
        },
      ],
    },
    {
      username: 'ddavids',
      email: 'hello@david.com',
      password: 'ddavids',
      messages: [
        {
          text: 'Happy to release ...',
          createdAt,
        },
        {
          text: 'Published a complete ...',
          createdAt,
        },
      ],
    },
  ];

  const options = { include: [models.Message] };

  await models.User.bulkCreate(newUsers, options);
}
