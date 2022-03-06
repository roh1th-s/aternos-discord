const { MessageEmbed } = require("discord.js");

const EmojiUtil = require("./EmojiUtil");

class EmbedUtil {
	static initialized = EmojiUtil.initialized;
	static colors = {
		Normal: "0x#0373fc",
		Success: "0x#469b2e",
		Error: "0x#c73232",
		Loading: "0x#469b2e",
	};
	static async initialize(client) {
		if (this.initialized) return;

		if (!EmojiUtil.initialized) await EmojiUtil.initialize(client);

		this.initialized = true;
		return this;
	}

	static SimpleEmbed(title, description) {
		const embed = new MessageEmbed().setColor(this.colors.Normal).setTitle(`${title}`);
		if (description) embed.setDescription(`${description}`);

		return embed;
	}

	static SuccessEmbed(title, description) {
		let success = EmojiUtil.formatted("animcheck");

		const embed = new MessageEmbed().setColor(this.colors.Success).setTitle(`${success} ${title}`);
		if (description) embed.setDescription(`${description}`);

		return embed;
	}

	static ErrorEmbed(title, description) {
		let error = EmojiUtil.formatted("animcross");

		const embed = new MessageEmbed().setColor(this.colors.Error).setTitle(`${error} ${title}`);
		if (description) embed.setDescription(`${description}`);

		return embed;
	}

	static LoadingEmbed(title, description) {
		const emoji = EmojiUtil.formatted("loadingdots");

		const embed = new MessageEmbed().setColor(this.colors.Loading).setTitle(`${title}`);
		if (description) embed.setDescription(`${emoji} ${description}`);

		return embed;
	}
}

module.exports = EmbedUtil;
