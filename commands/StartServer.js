const AternosUtil = require("../utils/AternosUtil");

class StartServer {
	constructor(client) {
		this.client = client;
		this.name = "StartServer";
		this.aliases = ["ss", "start"];
		this.description = "Start the aternos server.";
		this.usage = "start";
	}

	async execute(msg, args) {
		const prefix = msg.prefix;
		const embeds = this.client.embeds;
		const correctUsage = `\`${prefix}${this.usage}\``;

		AternosUtil.StartServer()
			.then((response) => {
				if (response.status == 200) 
					msg.reply({embeds: [
						embeds.SuccessEmbed("Server started!")
					]});
			})
			.catch((err) => {
				console.log(err);
			});
	}
}

module.exports = StartServer;
