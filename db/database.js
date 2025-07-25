const { Sequelize } = require('sequelize');
const betterSqlite3 = require('better-sqlite3');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  dialectModule: betterSqlite3,
  storage: './db.sqlite' // Or wherever your .sqlite file is located
});

module.exports = { sequelize };

const setup = async () => {
  await sequelize.sync({ force: true });
  console.log('Database initialized');
};

if (require.main === module) setup();

module.exports = { sequelize };
