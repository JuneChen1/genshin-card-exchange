require('dotenv').config();
const { DataSource } = require('typeorm');
const Users = require('../entities/users');
const Cards = require('../entities/cards');
const UserCards = require('../entities/user_cards');

const dataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  synchronize: false,
  poolSize: Number(process.env.DATABASE_POOL_SIZE) || 10,
  entities: [Users, Cards, UserCards],
  migrations: ['db/migrations/*.js']
});

module.exports = { dataSource };
