import TelegramApi from 'node-telegram-bot-api'
import { gameOptions, againOptions } from './options.js';
import { sequelize } from './db.js';
import { User, Message } from './models.js';

const token = '5802792418:AAFn70Ld3FSIucV96W0ysr18KBQ6YRaLL50'

const bot = new TelegramApi(token, { polling: true })

const chats = {};

async function startGame(chatId) {
    await bot.sendMessage(chatId, "🤫 Now I will think of a number from 0 to 10 🤫");
    const random = Math.floor(Math.random() * 10);
    console.log(random);
    chats[chatId] = random;
    setTimeout(async () => { await bot.sendMessage(chatId, ' 🎁 Try to guess the number and earn $1 🎁', gameOptions) }, 5000)
}

const start = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync({ alter: true });
        console.log('Connection has been established successfully.');
    } catch (err) {
        console.log(err);
    }
    bot.setMyCommands([
        { command: '/start', description: 'Registration in the system' },
        { command: '/information', description: 'Information' },
        { command: '/subscription', description: 'Subscription' },
        { command: '/earnmoney', description: 'Play the game and earn money' },
        { command: '/again', description: 'Guess again' },
    ])

    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;
        const user = await User.findOne({ where: { chatId } })
        try {
            if (text === '/start') {
                if (user) {
                    return bot.sendMessage(chatId, '🤑 You are already registered in the system 🤑');
                }
                await User.create({ chatId, username: msg.chat.username, messages: [], wrongAnswers: 0, rightAnswers: 0 });
                await bot.sendMessage(chatId, "Thank you for registering, here you can earn money by playing games. Good luck! Bot owner: @kaito1337")
                return bot.sendSticker(chatId, 'https://chpic.su/_data/stickers/m/mamatraxer/mamatraxer_003.webp')
            } else if (text === '/information') {
                if (!user) {
                    return bot.sendMessage(chatId, '🤡 You are not registered in our system. 🤡');
                }
                return bot.sendMessage(chatId, `Your name: @${user.dataValues.username}, You gave ${user.dataValues.rightAnswers} correct answers, and  ${user.dataValues.wrongAnswers} wrong answers, your prize is ${user.dataValues.rightAnswers}$`);
            } else if (text === '/earnmoney') {
                if (!user) {
                    return bot.sendMessage(chatId, '🤡 You are not registered in our system 🤡');
                }
                return startGame(chatId)
            } else if (text === '/subscription') {
                return await bot.sendInvoice(chatId, "Subscription", "1 month subscription", "test", "381764678:TEST:48369", "one-month-subscription", "RUB", [{ label: "k", amount: 30000 }]);
            }
            if (!msg.text.startsWith("/")) {
                await Message.create({ chatId, username: msg.chat.username, message: msg.text });
                return bot.sendMessage(chatId, "❗️ Command not found, see commandslist for more information ❗️")
            }
            return bot.sendMessage(chatId, "❗️ Command not found, see commandslist for more information ❗️")
        } catch (error) {
            console.log(error);
            return bot.sendMessage(chatId, "🚫🚫🚫  An error has occurred 🚫🚫🚫 ")
        }
    })

    bot.on('callback_query', async msg => {
        const data = msg.data
        const chatId = msg.message.chat.id;
        const user = await User.findOne({ where: { chatId } })
        if (data == chats[chatId]) {
            await User.update({ rightAnswers: ++user.rightAnswers }, {
                where: { chatId }
            })
            await bot.sendMessage(chatId, '💸');
            return bot.sendMessage(chatId, '💎💎💎 Congratulations, you guessed right, send us your card details and we will transfer the money 💎💎💎', againOptions);
        } else if (data == '/again') {
            return startGame(chatId)
        } else {
            await User.update({ wrongAnswers: ++user.wrongAnswers }, {
                where: { chatId }
            })
            return bot.sendMessage(chatId, `💩 You didn't guess, the bot guessed the number is ${chats[chatId]} 💩 `, againOptions)
        }
    })
}
start()