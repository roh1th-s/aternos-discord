require("dotenv").config();

const fs = require("fs");
const Config = require("./config.json");
const Discord = require("discord.js");

const Client = new Discord.Client({
	intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_EMOJIS_AND_STICKERS"],
});

const EmbedUtil = require("./utils/EmbedUtil");
const RequestUtil = require("./utils/RequestUtil");
RequestUtil.initialize(); //async

Client.config = Config;

Client.commands = new Discord.Collection();
Client.aliases = new Discord.Collection();
Client.cooldowns = new Discord.Collection();

const commandFiles = fs.readdirSync("./commands").filter((file) => file.endsWith(".js"));
for (const file of commandFiles) {
	let command = require(`./commands/${file}`);
	if (command.prototype && command.prototype.constructor) {
		command = new command(Client);
		Client.commands.set(command.name, command);
		if (command.aliases.length > 0) {
			for (let alias of command.aliases) {
				Client.aliases.set(alias, command);
			}
		}
	}
}

Client.once("ready", async () => {
	console.log(`Logged in as ${Client.user.tag}`);

	Client.embeds = await EmbedUtil.initialize(Client);
});

Client.on("messageCreate", (msg) => {
	if (msg.author.bot) return;

	const prefix = Client.config.prefix;
	if (msg.type != "REPLY" && msg.mentions.users.has(Client.user.id)) {
		msg.channel.send({
			embeds: [EmbedUtil.SimpleEmbed("Quick help", `My prefix is ${client.config.prefix}`)],
		});
	}

	if (!msg.content.startsWith(prefix)) return;

	if (!msg.guild) {
		return msg.reply({
			embeds: [EmbedUtil.ErrorEmbed("Invalid usage", "You can only use the bot in a server!")],
		});
	}

	msg.prefix = prefix;
	const args = msg.content.slice(prefix.length).split(/\s+/);
	const cmdName = args.shift().toLowerCase();

	let cmd = Client.commands.has(cmdName) && Client.commands.get(cmdName);
	cmd = cmd || (Client.aliases.has(cmdName) && Client.aliases.get(cmdName)); //assign if cmd is falsy

	if (cmd) {
		try {
			cmd.execute(msg, args);
		} catch (err) {
			console.log(err);

			msg.reply({
				embeds: [EmbedUtil.ErrorEmbed("Error", "Something went wrong!")],
			});
		}
	}
});

Client.login(process.env.TOKEN);
