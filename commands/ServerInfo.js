const axios = require("axios").default;

class ServerInfo {
	constructor(client) {
		this.client = client;
		this.name = "ServerInfo";
		this.aliases = ["i"];
		this.description = "Get information about the aternos server";
		this.usage = "info";
	}

	async execute(msg, args) {
		const prefix = msg.prefix;
		const correctUsage = `\`${prefix}${this.usage}\``;
	}
}

module.exports = ServerInfo;
