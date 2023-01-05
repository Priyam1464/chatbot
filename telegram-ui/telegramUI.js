module.exports.TelegramUI = class TelegramUI {
  static getKeyboard(chatId, text, type, options, itemsPerRow) {
    let replyData = {
      chat_id: chatId,
      allow_sending_without_reply: false,
    };
    let inlineKeyboard = [];

    if (text !== null) {
      replyData.text = text;
    } else {
      replyData.text = "Here is your dashboard";
    }
    if (options) {
      inlineKeyboard = options
        .map((option) => {
          if (option.callback_data) {
            return {
              text: option.text,
              callback_data: option.callback_data,
            };
          } else {
            return {
              text: option.text,
            };
          }
        })
        .reduce((accum, curr) => {
          if (accum.length == 0) {
            return [[curr]];
          } else if (accum[accum.length - 1].length < itemsPerRow) {
            return [
              ...accum.slice(0, accum.length - 1),
              [...accum[accum.length - 1], curr],
            ];
          } else {
            return [...accum.slice(0, accum.length), [curr]];
          }
        }, []);

      if (type === "inlineKeyboard") {
        replyData = {
          ...replyData,
          reply_markup: { inline_keyboard: inlineKeyboard },
        };
      } else {
        replyData = {
          ...replyData,
          reply_markup: { keyboard: inlineKeyboard },
        };
      }
    }
    return replyData;
  }

  static getText(chatId, text) {
    let replyData = {
      chat_id: chatId,
      text,
    };

    return replyData;
  }
};
