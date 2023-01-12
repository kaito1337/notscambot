import { DataTypes } from 'sequelize';
import { sequelize } from './db.js';

const User = sequelize.define('user', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    chatId: { type: DataTypes.INTEGER, unique: true },
    username: { type: DataTypes.STRING, unique: true },
    rightAnswers: { type: DataTypes.INTEGER },
    wrongAnswers: { type: DataTypes.INTEGER }
});

const Message = sequelize.define('message', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    chatId: { type: DataTypes.INTEGER },
    username: { type: DataTypes.STRING },
    message: { type: DataTypes.STRING }
})
export { User, Message };