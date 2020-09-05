exports.seed = async function (knex) {
  await knex('users').insert([
    {
      username: 'Larry',
      password: 'changeme'
    },
    {
      username: 'Moe',
      password: 'changeme'
    },
    {
      username: 'Curly',
      password: 'changeme'
    }
  ]);
};
