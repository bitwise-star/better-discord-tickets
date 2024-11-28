import "dotenv/config";
import "reflect-metadata";
import { dirname, importx } from "@discordx/importer";
import { IntentsBitField } from "discord.js";
import { Client } from "discordx";
import { dataSource } from "./database/connection.js";
import { Logger } from "./lib/logger.js";

export const bot = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.GuildMessageReactions,
    IntentsBitField.Flags.GuildVoiceStates,
    IntentsBitField.Flags.MessageContent,
    IntentsBitField.Flags.GuildPresences
  ],
  silent: true,
  simpleCommand: {
    prefix: "!",
  }
});

process.on("uncaughtException", (err) => {
  Logger.error(err);
});

process.on("unhandledRejection", (rejection) => {
  Logger.error(rejection);
});

async function run() {
  await importx(`${dirname(import.meta.url)}/{events,commands}/**/*.{ts,js}`);

  if (!process.env.BOT_TOKEN) {
    throw Error("Could not find BOT_TOKEN in your environment");
  }

  dataSource.initialize()
    .then(async () => {
      Logger.info("Connected with the database.")
      await bot.login(process.env.BOT_TOKEN as string);
    })
    .catch((err) => {
      Logger.error(err);
      process.exit(1);
    });
}

void run();
