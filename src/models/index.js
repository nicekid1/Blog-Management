const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'postgres',
});

sequelize.authenticate()
    .then(() => console.log('Database connected successfully.'))
    .catch(err => console.log('Error connecting to database:', err));

module.exports = sequelize;
