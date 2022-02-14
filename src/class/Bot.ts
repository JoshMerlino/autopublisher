import { Client, Intents } from "discord.js";
import JSONStore from "filestore-json";
import path from "path";

export default class Bot {

    // Initialize client
    static client = new Client({
    	intents: [
    	    Intents.FLAGS.GUILDS,
    	    Intents.FLAGS.GUILD_MESSAGES
    	]
    });

    // Aliases for commands
    static aliases = [
    	"/crosspost",
    	"/autopublish",
    	"/ap"
    ];

    // Colors
    static Color = {
    	SUCCESS: 0x00e676,
    	FAILURE: 0xff9100
    }

    // Login to Discord
    static start(): Promise<string> {
    	console.info("Logging in...");
    	return Bot.client.login(process.env.DISCORD_TOKEN);
    }

    // Initialize storage
    static storage = JSONStore.from<{ enabled_channels: string[] }>(path.resolve("./storage.json"));

}
