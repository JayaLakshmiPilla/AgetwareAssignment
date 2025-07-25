const { Sequelize } = require('sequelize');
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'db.sqlite'
});

const setup = async () => {
  await sequelize.sync({ force: true });
  console.log('Database initialized');
};

if (require.main === module) setup();

module.exports = { sequelize };
