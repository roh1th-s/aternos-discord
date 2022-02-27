const RequestUtil = require("./RequestUtil");

class AternosUtil {
	static axiosInstance;
	static TOKEN = process.env.ATERNOS_TOKEN || "";
	static SEC = ["sb79af3bo4000000","gzs8u6409t900000"]

	static #log(message) {
		console.log(`[AternosUtil] ${message}`);
	}
	static SetUpRequestInstance() {
		this.requestInstance = RequestUtil.createInstance({
			url: "https://aternos.org",
			cookies: [{
				name: "ATERNOS_SESSION",
				value: process.env.ATERNOS_SESSION,
			}, {
				name: "ATERNOS_SERVER",
				value: process.env.ATERNOS_SERVER,
			}, {
				name: `ATERNOS_SEC_${this.SEC[0]}`,
				value: this.SEC[1],
			}],
		});
	}

	static async StartServer(retry = true, tries) {
		if (!this.requestInstance) this.SetUpRequestInstance();
		if (!this.TOKEN) await this.ObtainToken();

		tries = tries || 0;
		return new Promise(async (resolve, reject) => {
			let response;
			try {
				response = await this.requestInstance.get(
					`/panel/ajax/start.php?headstart=0&access-credits=0&SEC=${this.SEC[0]}:${this.SEC[1]}&TOKEN=${this.TOKEN}`
				);

				resolve(response);
			} catch (err) {
				if (retry) { 
					if (tries >= 3) {
						this.#log("Tried starting server 3 times, giving up.");
						reject(err);
						return;
						
					}
					try {
						this.#log(`Request to start server failed, trying again... (Retry ${++tries})`);
						this.TOKEN = ""; //reset token
						await this.StartServer(true, tries);
					} catch(err) {
						reject(err)
					}
				}
				reject(err)		
			}
		});
	}

	static async StopServer(retry = true, tries) {
		if (!this.requestInstance) this.SetUpRequestInstance();
		if (!this.TOKEN) await this.ObtainToken();

		tries = tries || 0;

		return new Promise(async (resolve, reject) => {
			let response;
			try {
				response = await this.requestInstance.get(
					`/panel/ajax/stop.php?SEC=${this.SEC[0]}:${this.SEC[1]}&TOKEN=${this.TOKEN}`
				);

				resolve(response);
			} catch (err) {
				if (retry) {
					if (tries >= 3) {
						this.#log("Tried stopping server 3 times, giving up.");
						reject(err);
					}
					try {
						this.#log(`Request to stop server failed, trying again... (Retry ${++tries})`);
						this.TOKEN = ""; //reset token

						await this.StopServer(true, tries);
					} catch(err) {
						reject(err)
					}
				}
				reject(err)
			}
		});
	}

	static async GetServerPage() {
		if (!this.requestInstance) this.SetUpRequestInstance();

		return new Promise(async (resolve, reject) => {
			let response;
			try {
				response = await this.requestInstance.get("/server");
				
				resolve(response);
			} catch (err) {
				reject(err);
			}
		});
	}
	static async CheckToken(t = this.TOKEN) {
		if (!this.requestInstance) this.SetUpRequestInstance();

		return new Promise(async (resolve, reject) => {
			let response;
			try {
				response = await this.requestInstance.get(`/panel/ajax/options/timezone.php?SEC=${this.SEC[0]}:${this.SEC[1]}&TOKEN=${t}`);

				if (response.status == 200) {
					resolve(true)
				} else {
					resolve(false)
				}

			} catch (err) {
				reject(err);
			}
		});
	}

	static async ObtainToken() {
		return new Promise(async (resolve, reject) => {
			let response;
			try {
				this.#log("Trying to extract token from server page...");
				response = await this.GetServerPage();

				this.#log("Finding js code to run");
				let js = response.body.match(/<script type='text\/javascript'>(.+?)<\/script>/g)
				let token;

				if(js) {
					js = js[0].replace("<script type='text/javascript'>", "")
					.replace("</script>", "");

					this.#log("Found code, trying variations to extract token.");
					for (let i = 0; i <= 1; i++) {
						for (let j = 0; j <= 1; j++) {
							for(let k = 0; k <= 1; k++) {
								let t = eval(
									`const window = {
										document : ${Boolean(i)},
										Map : ${Boolean(j)},
										setTimeout : ${Boolean(k)},
									};
							
									${js}

									window["AJAX_TOKEN"]
								`)	
								
								let isValid = await this.CheckToken(t);

								if (isValid)
									token = t;
								
								if (token) break;
							}
							if (token) break;
						}
						if (token) break;
					}

					if(!token) throw "Could not obtain token.";
					
					this.#log("Token found : " + token);
					this.TOKEN = token;	
				} else { 
					throw "Could not obtain token.";
				}

				resolve(this.TOKEN);
			} catch (err) {
				console.log(err);
				reject(err);
			}
		});
	}
}

module.exports = AternosUtil;
