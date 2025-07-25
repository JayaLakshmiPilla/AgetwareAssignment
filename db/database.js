const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false // important for Render SSL
    }
  }
});



const setup = async () => {
  await sequelize.sync({ force: true });
  console.log('Database initialized');
};

if (require.main === module) setup();

module.exports = { sequelize };
