const log4js = require('log4js');
const logger = log4js.getLogger('system');
const knex = appRequire('init/knex').knex;
const cron = appRequire('init/cron');
const config = appRequire('services/config').all();
const token = config.plugins.webgui_telegram.token;
const axios = require('axios');
const url = `https://api.telegram.org/bot${ token }/`;

const sleep = time => new Promise(resolve => setTimeout(resolve, time));

const sendMessage = async (text, chat_id, reply_to_message_id) => {
  try {
    const response = await axios.get(url + 'sendMessage', {
      params: {
        chat_id,
        text,
        reply_to_message_id,
      },
    });
    return response.data;
  } catch (error) {
    logger.error('Telegram sendMessage error:', error.message);
    throw error;
  }
};

const sendMarkdown = async (text, chat_id) => {
  try {
    const response = await axios.get(url + 'sendMessage', {
      params: {
        chat_id,
        text,
        parse_mode: 'Markdown',
      },
    });
    return response.data;
  } catch (error) {
    logger.error('Telegram sendMarkdown error:', error.message);
    throw error;
  }
};

const sendKeyboard = async (text, chat_id, keyboard) => {
  try {
    const response = await axios.get(url + 'sendMessage', {
      params: {
        chat_id,
        text,
        reply_markup: JSON.stringify(keyboard),
      },
    });
    return response.data;
  } catch (error) {
    logger.error('Telegram sendKeyboard error:', error.message);
    throw error;
  }
};

const sendPhoto = async (photo, chat_id) => {
  try {
    const response = await axios.get(url + 'sendPhoto', {
      params: {
        chat_id,
        photo,
      },
    });
    return response.data;
  } catch (error) {
    logger.error('Telegram sendPhoto error:', error.message);
    throw error;
  }
};

const EventEmitter = require('events');
class Telegram extends EventEmitter {}
const telegram = new Telegram();

telegram.on('reply', (message, text) => {
  const chat_id = message.message.chat.id;
  const reply_to_message_id = message.message.message_id;
  sendMessage(text, chat_id, reply_to_message_id);
});
telegram.on('send', (chat_id, text) => {
  sendMessage(text, chat_id);
});
telegram.on('markdwon', (chat_id, text) => {
  sendMarkdown(text, chat_id);
});
telegram.on('keyboard', (chat_id, text, keyboard) => {
  sendKeyboard(text, chat_id, JSON.stringify(keyboard));
});
telegram.on('photo', (chat_id, photo) => {
  sendPhoto(photo, chat_id);
});

const setUpdateId = async (id) => {
  try {
    const result = await knex('webgui_telegram').select(['value']).where({key: 'updateId'});
    if(result.length === 0) {
      await knex('webgui_telegram').insert({
        key: 'updateId',
        value: id || 1,
      });
    } else {
      await knex('webgui_telegram').where({key: 'updateId'}).update({
        value: id,
      });
    }
    return id;
  } catch(err) {
    return Promise.reject(err);
  }
};

const getUpdateId = async () => {
  try {
    const result = await knex('webgui_telegram').select(['value']).where({key: 'updateId'});
    if(result.length === 0) {
      return 1;
    } else {
      return result[0].value;
    }
  } catch(err) {
    return Promise.reject(err);
  }
};

const getMessage = async () => {
  const updateId = await getUpdateId();
  try {
    const response = await axios.get(url + 'getUpdates', {
      params: {
        offset: updateId,
        timeout: 30,
      },
    });
    const resultObj = response.data;
    if(resultObj.ok && resultObj.result.length) {
      resultObj.result.forEach(message => {
        logger.info(message);
        telegram.emit('message', message);
      });
      await setUpdateId(resultObj.result[resultObj.result.length - 1].update_id + 1);
    } else {
      await sleep(15000);
    }
  } catch (err) {
    logger.error('Telegram getMessage error:', err.message);
    await sleep(3000);
    return;
  }
};

const getMe = async () => {
  const response = await axios.get(url + 'getMe');
  return response.data;
};

const isUser = async telegramId => {
  const exists = await knex('user').where({
    telegram: telegramId,
    type: 'normal',
  }).then(success => success[0]);
  if(!exists) { return Promise.reject('not a tg user'); }
  return exists.id;
};

const isAdmin = async telegramId => {
  const exists = await knex('user').where({
    telegram: telegramId,
    type: 'admin',
  }).then(success => success[0]);
  if(!exists) { return Promise.reject('not a tg user'); }
  return exists.id;
};

const isNotUserOrAdmin = async telegramId => {
  const exists = await knex('user').where({
    telegram: telegramId,
  }).then(success => success[0]);
  if(exists) { return Promise.reject('is a user'); }
  return;
};

const getUserStatus = async telegramId => {
  const user = await knex('user').where({
    telegram: telegramId,
  }).then(success => success[0]);
  if(!user) {
    return { status: 'empty' };
  } else {
    return { status: user.type, id: user.id };
  }
};

cron.loop(async () => {
  await getMessage();
}, 'WebguiTelegramGetMessage', 45);

exports.telegram = telegram;

exports.getMe = getMe;
exports.isUser = isUser;
exports.isAdmin = isAdmin;
exports.isNotUserOrAdmin = isNotUserOrAdmin;
exports.getUserStatus = getUserStatus;

exports.sendKeyboard = sendKeyboard;
exports.sendMarkdown = sendMarkdown;
exports.sendMessage = sendMessage;
exports.sendPhoto = sendPhoto;

appRequire('plugins/webgui_telegram/user');
appRequire('plugins/webgui_telegram/help');
appRequire('plugins/webgui_telegram/account');
appRequire('plugins/webgui_telegram/flow');
