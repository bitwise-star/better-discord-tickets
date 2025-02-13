import "dotenv/config";
import "reflect-metadata";
import logger from "pino";
import { dirname, importx } from "@discordx/importer";
import { IntentsBitField } from "discord.js";
import { Client } from "discordx";
import { dataSource } from "./database/connection.js";

export const Logger = logger();
export const bot = new Client({
	intents: [
		IntentsBitField.Flags.Guilds,
		IntentsBitField.Flags.GuildMembers,
		IntentsBitField.Flags.GuildMessages,
		IntentsBitField.Flags.GuildMessageReactions,
		IntentsBitField.Flags.GuildVoiceStates,
		IntentsBitField.Flags.MessageContent,
	],
	silent: false,
	simpleCommand: {
		prefix: "!",
	},
});

await dataSource.initialize()
	.catch((err) => {
		Logger.error(err);
		process.exit(-1);
	});

async function run() {
	await importx(`${dirname(import.meta.url)}/{events,commands,interactions}/**/*.{ts,js}`);

	if (!process.env.BOT_TOKEN) {
		throw Error("Could not find BOT_TOKEN in your environment");
	}

	await bot.login(process.env.BOT_TOKEN);
}

void run();