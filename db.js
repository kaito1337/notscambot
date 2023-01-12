import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();
const sequelize = new Sequelize(
    process.env.NAME,
    process.env.USER,
    process.env.PASSWORD,
    {
        dialect: process.env.DIALECT,
        host: process.env.HOST,
        port: process.env.DB_PORT,
    }
)
export { sequelize }