// Configure variables in environment file (.env)
import chalk from "chalk";
import dotenv from "dotenv";
import Bot from "./class/Bot";
import console from "./console";
dotenv.config();

// On ready
Bot.client.on("ready", async function() {

	// Log tag
	console.info("Logged in as", chalk.cyan(Bot.client.user?.tag));

});

// On message
Bot.client.on("messageCreate", async function(message) {

	// Destructure message
	const { author, channel } = message;

	// Ignore bot messages
	if (author.bot) return;

	// Ignore messages outside of news channels
	if (channel.type !== "GUILD_NEWS") return;

	// Crosspost to news channels
	await message.crosspost();

});

// Start bot
Bot.start();
