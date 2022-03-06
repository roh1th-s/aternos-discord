class EmojiUtil {
	static client = null;
	static emojiGuild = null;
	static initialized = false;

	static async initialize(client) {
		if (this.initialized) return;

		if (!client) {
			console.log("[EmojiUtil] Client not provided");
			return;
		}

		this.client = client;

		if (!this.emojiGuild) {
			this.emojiGuild = await client.guilds.fetch("849218716922544138");
			await this.emojiGuild.emojis.fetch();
		}

		this.initialized = true;
		return this;
	}

	static formatted(emojiName) {
		const emoji = this.emojiGuild.emojis.cache.find((emoji) => emoji.name.toLowerCase() === emojiName);

		if (!emoji) return "";

		return `${emoji}`;
	}
}

module.exports = EmojiUtil;
