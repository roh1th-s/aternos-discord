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
		const correctUsage = `\`${prefix}${this.usage}\``;

		AternosUtil.StopServer()
			.then((response) => {
				console.log(response.status);
				if (response.status == 200) 
					msg.reply("Stopping the server");
			})
			.catch((err) => {
				console.log(err);
				console.log(err.response.data);
				require("fs").writeFileSync("index.html", err.response.data);
			});
	}
}

module.exports = StopServer;
