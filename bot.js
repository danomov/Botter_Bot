let Discord = require("discord.io");
let logger = require("winston");
const fetch = require("node-fetch");
const token = process.env.TOKEN;

function configer() {
  logger.remove(logger.transports.Console);
  logger.add(new logger.transports.Console(), {
    colorize: true,
  });
  logger.level = "debug";
}

configer();

// Initialize Discord Bot
let bot = new Discord.Client({
  token,
  autorun: true,
});
bot.on("ready", function (evt) {
  logger.info("Connected");
  logger.info("Logged in as: ");
  logger.info(bot.username + " - (" + bot.id + ")");
});

// Joke teller api (Joke API)
const jokeTeller = async () => {
  const res = await fetch("https://joke3.p.rapidapi.com/v1/joke", {
    method: "GET",
    headers: {
      "x-rapidapi-host": "joke3.p.rapidapi.com",
      "x-rapidapi-key": "98061a671bmsh02ad22d36807bf3p113143jsn8aa932aabf70",
    },
  });

  const data = await res.json();
  return data.content;
};

const coinFlipper = () => {
  const coinSides = ["heads", "tails"];
  const random = Math.round(Math.random());
  const flip = coinSides[random];

  return flip;
};

// Our bot needs to know if it will execute a command
bot.on("message", async function (user, userID, channelID, message, evt) {
  let typedText = message.substring(1).split(" ");
  let cmnd = typedText[0].toUpperCase();
  // It will listen for messages that will start with `!`
  if (message.substring(0, 1) === "!") {
    switch (cmnd) {
      case "PING":
        bot.sendMessage({
          to: channelID,
          message: "Pong!",
        });
        break;
      case "HELLO":
        bot.sendMessage({
          to: channelID,
          message: `Hello dear ${user}, happy to see you there! 👋😀`,
        });
        break;
      case "JOKE":
        const joke = await jokeTeller();
        bot.sendMessage({
          to: channelID,
          message: joke === "err" ? "Ooops, some error!" : joke,
        });
        break;
    }
  }

  // It will listen for messages that will start with `0` or `O` or `o`
  if (
    message.substring(0, 1) === "O" ||
    message.substring(0, 1) === "o" ||
    message.substring(0, 1) === "0"
  ) {
    let coin;

    switch (cmnd) {
      case "HEADS":
        coin = coinFlipper();
        bot.sendMessage({
          to: channelID,
          message:
            coin.toUpperCase() === cmnd
              ? `${coin}, CONGRATS, YOU WIN! 🏆`
              : `${coin}, Try next time, my friend! ✊`,
        });
        break;
      case "TAILS":
        coin = coinFlipper();
        bot.sendMessage({
          to: channelID,
          message:
            coin.toUpperCase() === cmnd
              ? `${coin}, CONGRATS, YOU WIN! 🏆`
              : `${coin}, Try next time, my friend! ✊`,
        });
    }
  }
});
