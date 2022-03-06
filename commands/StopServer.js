const AternosUtil = require("../utils/AternosUtil");

class StopServer {
	constructor(client) {
		this.client = client;
		this.name = "StopServer";
		this.aliases = ["stop"];
		this.description = "Stop the aternos server.";
		this.usage = "stop";
	}

	async execute(msg, args) {
		const prefix = msg.prefix;
		const embeds = this.client.embeds;
		const correctUsage = `\`${prefix}${this.usage}\``;

		AternosUtil.StopServer()
			.then((response) => {
				if (response.status == 200) 
				msg.reply({ 
					embeds: [
						embeds.SimpleEmbed("Server stopped.")
							.setColor(embeds.colors.Error)
					] 
				});
			})
			.catch((err) => {
				console.log(err);
			});
	}
}

module.exports = StopServer;
