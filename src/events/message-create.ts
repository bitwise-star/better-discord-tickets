import { type ArgsOf, type Client, Discord, On } from "discordx";
import { Logger } from "../main.js";

@Discord()
export class Event {
    @On({ event: "messageCreate" })
    async exec([message]: ArgsOf<"messageCreate">, client: Client) {
        try {
            await client.executeCommand(message);
        } catch (err) {
            Logger.error(err);
        }
    }
}