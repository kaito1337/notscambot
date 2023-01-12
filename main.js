import TelegramApi from 'node-telegram-bot-api'
import { gameOptions, againOptions } from './options.js';

const token = '5802792418:AAFn70Ld3FSIucV96W0ysr18KBQ6YRaLL50'

const bot = new TelegramApi(token, { polling: true })

const chats = {};

async function startGame(chatId) {
    await bot.sendMessage(chatId, "Сейчас я загадаю цифру от 0 до 10");
    const random = Math.floor(Math.random() * 10);
    chats[chatId] = random;
    console.log(chats);
    await bot.sendMessage(chatId, 'Попробуй отгадать число и заработаешь 100 деревянных', gameOptions)
}

bot.on('message', async msg => {
    const text = msg.text;
    const chatId = msg.chat.id;
    bot.setMyCommands([
        { command: '/start', description: 'Ознакомление с ботом' },
        { command: '/help', description: 'Помощь' },
        { command: '/game', description: 'Попробовать выиграть деньги' },
        { command: '/again', description: 'Попробовать снова сыграть в игру' }
    ])
    if (text === '/start') {
        await bot.sendMessage(chatId, "Приветствуем вас в тестовом боте, в данном боте вы можете сыграть в игру и заработать шекелей")
        return bot.sendSticker(chatId, 'https://chpic.su/_data/stickers/m/mamatraxer/mamatraxer_003.webp')
    } else if (text === '/help') {
        return bot.sendMessage(chatId, "Помощь")
    } else if (text === '/game') {
        return startGame(chatId)
    }
    console.log(msg.text)
    return bot.sendMessage(chatId, "Команда не найдена, ознакомьтесь со списком команд")
})

bot.on('callback_query', async msg => {
    const data = msg.data
    const chatId = msg.message.chat.id;
    if (data == chats[chatId]) {
        return bot.sendMessage(chatId, 'Поздравляю ты угадал, пришли нам свои данные карты и мы обязательно переведем тебе деньги', againOptions);
    } else if (data == '/again') {
        return startGame(chatId)
    } else {
        return bot.sendMessage(chatId, "Ты не угадал, бот загадал цифру " + chats[chatId], againOptions)
    }
})