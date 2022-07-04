const Discord = require("discord.js")
const dotenv = require("dotenv")
const { REST } = require("@discordjs/rest")
const { Routes } = require("discord-api-types/v9")
const fs = require("fs")
const { Player } = require("discord-player")

dotenv.config()
const TOKEN = process.env.TOKEN

const LOAD_SLASH = process.argv[2] == "load"

const CLIENT_ID = "992933887095357531" // Bot ID
const GUILD_ID = "946858538708393994"  // ID do servidor

const client = new Discord.Client({
    intents: [
        "GUILDS",
        "GUILD_VOICE_STATES"
    ]
})

client.slashcommands = new Discord.Collection()
client.player = new Player(client, {
    ytdlOptions: {
        quality: "highestaudio",
        highWaterMark: 1 << 25
    }
})

let commands = []

const slashFiles = fs.readdirSync("./slash").filter(file => file.endsWith(".js"))
for (const file of slashFiles){
    const slashcmd = require(`./slash/${file}`)
    client.slashcommands.set(slashcmd.data.name, slashcmd)
    if (LOAD_SLASH) commands.push(slashcmd.data.toJSON())
}

if (LOAD_SLASH) {
    const rest = new REST({ version: "9" }).setToken(TOKEN)
    console.log("Deploying slash commands")
    rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), {body: commands})
    .then(() => {
        console.log("Successfully loaded")
        process.exit(0)
    })
    .catch((err) => {
        if (err){
            console.log(err)
            process.exit(1)
        }
    })
}
else {
    client.on("ready", () => {
        console.log(`Logged in as ${client.user.tag}`)
    })
    client.on("interactionCreate", (interaction) => {
        async function handleCommand() {
            if (!interaction.isCommand()) return

            const slashcmd = client.slashcommands.get(interaction.commandName)
            if (!slashcmd) interaction.reply("Not a valid slash command")

            await interaction.deferReply()
            await slashcmd.run({ client, interaction })
        }
        handleCommand()
    })
    client.login(TOKEN)
}













// const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES"] });

// let Bot = {
//   client,
//   prefix: "-",
//   owners: ["304391618440462337"],
// };

// client.commands = new Discord.Collection();
// client.events = new Discord.Collection();

// client.loadEvents = (bot, reload) => require("./handlers/events")(bot, reload);
// client.loadCommands = (bot, reload) =>
//   require("./handlers/commands")(bot, reload);

// client.loadEvents(Bot, false);
// client.loadCommands(Bot, false);

// module.exports = Bot;

// const prefix = "$";

// client.once("ready", () => {
//     console.log("UEEEEEPAAAAAA");
// });

// client.on("messageCreate", message => {
//     if (!message.content.startsWith(prefix) || message.author.bot) return;

//     const args = message.content.slice(prefix.length).split(/ +/);
//     const command = args.shift().toLowerCase();
//     console.log("args", args);
//     console.log("command", command);

//     switch (command) {
//         case "ui":
//             message.channel.send("UUUIIIII");
//             break;
//         case "danca":
//             message.channel.send("Danca gatinho danca!");
//             break;
//         case "help":
//             message.channel.send("Command list: \n 1. ui\n2. danca");
//             break;
//         default:
//             message.channel.send(`Invalido: ${prefix}HELP para lista de comandos`);
//             break;
//     }
//     if (command === "ping") {
//         message.channel.send("pong!");
//     }
// });

// Gives access to bot
// client.login(TOKEN);
