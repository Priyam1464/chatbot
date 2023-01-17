require("dotenv").config();
const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const { Telegraf } = require("telegraf");
const { message } = require("telegraf/filters");
const { chatbotConfig } = require("./chatbot.config");
const { TelegramUI } = require("./telegram-ui/telegramUI");
const { TOKEN, SERVER_URL, API_URL } = process.env;
const TELEGRAM_API = `https://api.telegram.org/bot${TOKEN}`;
const URI = `/webhook/${TOKEN}`;
const WEBHOOK_URL = SERVER_URL + URI;
const UPDATES_URL = TELEGRAM_API + "/setChatMenuButton";
const CALLBACK_QUERY_URL = TELEGRAM_API + "/answerCallbackQuery";

const app = express();
app.use(bodyParser.json());

const bot = new Telegraf(TOKEN);
let text;

const init = async () => {
  const res = await axios.get(`${TELEGRAM_API}/setWebhook?url=${WEBHOOK_URL}`);
  console.log(res.data);
};

const getUser = async (telegramId) => {
  const existenceArr = (
    await Promise.all([
      axios.get(`${API_URL}/candidate/${telegramId}`),
      axios.get(`${API_URL}/recruiter/${telegramId}`),
    ])
  ).map((res) => res.data);

  if (existenceArr[0].data !== null)
    return { type: "candidate", ...existenceArr[0].data };

  if (existenceArr[1].data !== null)
    return { type: "recruiter", ...existenceArr[1].data };

  return null;
};

app.post(URI, async (req, res) => {
  console.log(req.body);

  if (req.body.message) {
    const user = await getUser(req.body.message.from.username);

    const chatId = req.body.message.chat.id;
    console.log("chat", chatId);
    text = req.body.message.text;

    if (text === "/start" && user === null) {
      await axios.post(
        `${TELEGRAM_API}/sendMessage`,
        TelegramUI.getKeyboard(
          chatId,
          chatbotConfig["start"].text,
          chatbotConfig["start"].replyType,
          chatbotConfig["start"].options,
          3
        )
      );
    } else {
      if (user) {
        if (!Array.isArray(user.lastReplyPending)) {
          const username = req.body.message.chat.username;

          if (
            chatbotConfig[user.lastReplyPending] &&
            chatbotConfig[user.lastReplyPending].api
          ) {
            console.log("last", chatbotConfig[user.lastReplyPending]);
            await axios.patch(`${API_URL}/${user.type}/${user.telegramId}`, {
              lastReplyPending: chatbotConfig[user.lastReplyPending].next,
              [typeof chatbotConfig[user.lastReplyPending].api.bodyParam ===
              "object"
                ? chatbotConfig[user.lastReplyPending].api.bodyParam.key
                : chatbotConfig[user.lastReplyPending].api.bodyParam]:
                typeof chatbotConfig[user.lastReplyPending].api.bodyParam ===
                "object"
                  ? {
                      [chatbotConfig[user.lastReplyPending].api.bodyParam.key]:
                        req.body.message.text,
                    }
                  : req.body.message.text,
            });
          }
          const nextStep = chatbotConfig[user.lastReplyPending].next;

          if (
            !Array.isArray(user.lastReplyPending) &&
            chatbotConfig[user.lastReplyPending].replyType === "keyboard"
          ) {
            await axios.post(
              `${TELEGRAM_API}/sendMessage`,
              TelegramUI.getKeyboard(
                chatId,
                null,
                chatbotConfig[user.lastReplyPending].replyType,
                chatbotConfig[user.lastReplyPending].options,
                3
              )
            );
          } else if (
            !Array.isArray(chatbotConfig[nextStep]) &&
            chatbotConfig[nextStep].text
          ) {
            if (chatbotConfig[nextStep].replyType !== "inlineKeyboard") {
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
        } else {
          if (
            user.lastReplyPending.findIndex(
              (element) => element.text === text
            ) !== -1
          ) {
            let data = null;

            if (
              chatbotConfig[
                user.lastReplyPending[
                  user.lastReplyPending.findIndex(
                    (element) => element.text === text
                  )
                ].id
              ].api.reqType !== "patch"
            ) {
              data = (
                await axios.get(
                  `${API_URL}/${user.type}${
                    chatbotConfig[
                      user.lastReplyPending[
                        user.lastReplyPending.findIndex(
                          (element) => element.text === text
                        )
                      ].id
                    ].api.endpoint
                  }${user.telegramId}`
                )
              ).data.data;
            } else {
              await axios.patch(`${API_URL}/${user.type}/${user.telegramId}`, {
                lastReplyPending:
                  user.lastReplyPending[
                    user.lastReplyPending.findIndex(
                      (element) => element.text === text
                    )
                  ].id,
              });
            }

            await axios.post(
              `${TELEGRAM_API}/sendMessage`,
              TelegramUI.getText(
                chatId,
                data !== null
                  ? data
                  : chatbotConfig[
                      user.lastReplyPending[
                        user.lastReplyPending.findIndex(
                          (element) => element.text === text
                        )
                      ].id
                    ].text
              )
            );
          }
        }
      }
    }
  } else if (req.body.callback_query) {
    console.log("text", req.body.callback_query);
    const user = await getUser(req.body.callback_query.from.username);

    if (text === "/start") {
      await axios.post(
        `${TELEGRAM_API}/sendMessage`,
        TelegramUI.getText(
          req.body.callback_query.from.id,
          `${req.body.callback_query.data} Ok got it`
        )
      );
      console.log("new");

      await axios.post(
        `${TELEGRAM_API}/sendMessage`,
        TelegramUI.getText(
          req.body.callback_query.from.id,
          chatbotConfig[req.body.callback_query.data.toLowerCase()].text
        )
      );

      await axios.post(
        `${API_URL}/${req.body.callback_query.data.toLowerCase()}/`,
        {
          lastReplyPending: req.body.callback_query.data.toLowerCase(),
          telegramId: req.body.callback_query.from.username,
        }
      );
    } else {
      const text = req.body.callback_query.data;
      const nextSteps = chatbotConfig[user.lastReplyPending].next;
      let nextStep;

      if (Array.isArray(nextSteps)) {
        nextStep = nextSteps.filter((step) => step.callback_data === text)[0]
          .id;
      } else {
        nextStep = nextSteps;
      }

      if (
        chatbotConfig[user.lastReplyPending] &&
        chatbotConfig[user.lastReplyPending].api
      ) {
        console.log("last", chatbotConfig[user.lastReplyPending]);
        await axios.patch(`${API_URL}/${user.type}/${user.telegramId}`, {
          lastReplyPending: nextStep,
          [chatbotConfig[user.lastReplyPending].api.bodyParam]: text,
        });
      }

      if (chatbotConfig[nextStep].replyType) {
        if (chatbotConfig[nextStep].replyType === "text") {
          await axios.post(
            `${TELEGRAM_API}/sendMessage`,
            TelegramUI.getText(
              req.body.callback_query.from.id,
              chatbotConfig[nextStep].text
            )
          );
        } else {
          console.log("here");
          await axios.post(
            `${TELEGRAM_API}/sendMessage`,
            TelegramUI.getKeyboard(
              req.body.callback_query.from.id,
              chatbotConfig[nextStep].text !== null
                ? chatbotConfig[nextStep].text
                : null,
              chatbotConfig[nextStep].replyType,
              chatbotConfig[nextStep].options,
              3
            )
          );
        }
      } else {
        await axios.patch(`${API_URL}/${user.type}/${user.telegramId}`, {
          lastReplyPending: chatbotConfig[nextStep].next,
        });

        if (chatbotConfig[nextStep].replyType === "text") {
          await axios.post(
            `${TELEGRAM_API}/sendMessage`,
            TelegramUI.getText(
              req.body.callback_query.from.id,
              chatbotConfig[chatbotConfig[nextStep].next].text
            )
          );
        } else {
          console.log("here");
          await axios.post(
            `${TELEGRAM_API}/sendMessage`,
            TelegramUI.getKeyboard(
              req.body.callback_query.from.id,
              chatbotConfig[chatbotConfig[nextStep].next].text !== null
                ? chatbotConfig[chatbotConfig[nextStep].next].text
                : null,
              chatbotConfig[chatbotConfig[nextStep].next].replyType,
              chatbotConfig[chatbotConfig[nextStep].next].options,
              3
            )
          );
        }
      }
    }
  }
  return res.send();
});

app.listen(process.env.PORT || 8000, async () => {
  console.log("🚀 app running on port", process.env.PORT || 8000);
  await init();
  // bot.launch();
});
