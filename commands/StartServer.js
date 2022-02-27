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
		const correctUsage = `\`${prefix}${this.usage}\``;

		AternosUtil.StartServer()
			.then((response) => {
				console.log(response.status);
				if (response.status == 200) 
					msg.reply("Starting the server");
			})
			.catch((err) => {
				console.log(err);
				console.log(err.response.data);
				require("fs").writeFileSync("index.html", err.response.data);
			});
	}
}

module.exports = StartServer;
