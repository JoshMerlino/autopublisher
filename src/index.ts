// Configure variables in environment file (.env)
import chalk from "chalk";
import { GuildChannel, MessageEmbed, TextChannel, TextChannelResolvable } from "discord.js";
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

	// Get state
	function getState() {
		if (!Bot.storage.value.hasOwnProperty("enabled_channels")) Bot.storage.value = { enabled_channels: [] };
		return Bot.storage.value.enabled_channels.includes(channel.id);
	}

	// Ignore bot messages
	if (author.bot) return;

	// If the message is the command
	if (message.content.toLowerCase().startsWith("/")) {

		// Get the command and args
		const [ command, subcommand ] = message.content.split(" ");
		let newState: boolean;

		// Get enabled channels
		let { enabled_channels } = Bot.storage.value;

		// If its the command
		if (Bot.aliases.includes(command.toLowerCase())) {

			// Get subcommand
			switch (subcommand.toLowerCase()) {

			case "enable":
			case "e":
				newState = true;
				break;

			case "disable":
			case "d":
				newState = false;
				break;

			case "toggle":
			case "t":
				newState = !getState();
				break;

			default:
				const embed = new MessageEmbed;
				embed.setTitle("Invalid subcommand");
				embed.setColor(Bot.Color.FAILURE);
				embed.setDescription("Valid subcommands are: `enable`, `disable`, `toggle`");
				await channel.send({ embeds: [ embed ]});
				return;

			}

			// If enabled
			if (newState) {
				if (!enabled_channels.includes(channel.id)) {
					enabled_channels.push(channel.id);
					const embed = new MessageEmbed;
					embed.setTitle("Enabled automatic publishing");
					embed.setColor(Bot.Color.SUCCESS);
					await channel.send({ embeds: [ embed ]});
				} else {
					const embed = new MessageEmbed;
					embed.setTitle("Automatic publishing is already enabled");
					embed.setColor(Bot.Color.FAILURE);
					await channel.send({ embeds: [ embed ]});
				}
			}

			// If disabled
			if (!newState) {
				if (!enabled_channels.includes(channel.id)) {
					enabled_channels = enabled_channels.filter(id => id !== channel.id);
					const embed = new MessageEmbed;
					embed.setTitle("Disabled automatic publishing");
					embed.setColor(Bot.Color.SUCCESS);
					await channel.send({ embeds: [ embed ]});
				} else {
					const embed = new MessageEmbed;
					embed.setTitle("Automatic publishing is already disabled");
					embed.setColor(Bot.Color.FAILURE);
					await channel.send({ embeds: [ embed ]});
				}
			}

			Bot.storage.value = { enabled_channels };

			return;

		}

	}

	// Ignore messages outside of news channels
	if (channel.type !== "GUILD_NEWS") return;

	// If its enabled, crosspost to news channels
	if (getState()) {
		await message.crosspost();
	}

});

// Start bot
Bot.start();
