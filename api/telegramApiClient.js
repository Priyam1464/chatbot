module.exports.TelegramApiClient = class TelegramApiClient {
  async sendTelegramMessage(chatId, chatbotConfig, replyType) {
    if (replyType !== "inlineKeyboard") {
      await axios.post(
        `${TELEGRAM_API}/sendMessage`,
        TelegramUI.getText(chatId, chatbotConfig[nextStep].text)
      );
    } else {
      await axios.post(
        `${TELEGRAM_API}/sendMessage`,
        TelegramUI.getKeyboard(
          chatId,
          chatbotConfig[nextStep].text,
          chatbotConfig[nextStep].replyType,
          chatbotConfig[nextStep].options,
          3
        )
      );
    }
  }
};
