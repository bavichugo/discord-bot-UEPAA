const Discord = require("discord.js");
require("dotenv").config()

const client = new Discord.Client({intents: [
    "GUILDS",
    "GUILD_MESSAGES"
    ]
});

const prefix = "$";

client.once("ready", () => {
    console.log("UEEEEEPAAAAAA");
});

client.on("messageCreate", message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();
    console.log("args", args);
    console.log("command", command);

    switch (command) {
        case "ui":
            message.channel.send("UUUIIIII");
            break;
        case "danca":
            message.channel.send("Danca gatinho danca!");
            break;
        case "help":
            message.channel.send("Command list: \n 1. ui\n2. danca");
            break;
        default:
            message.channel.send(`Invalido: ${prefix}HELP para lista de comandos`);
            break;
    }
    if (command === "ping") {
        message.channel.send("pong!");
    }
});

// Gives access to bot
client.login(process.env.TOKEN);
