import { type ArgsOf, type Client, Discord, On } from "discordx";
import { Logger } from "../main.js";

@Discord()
export class Event {
    @On({ event: "interactionCreate" })
    async exec([interaction]: ArgsOf<"interactionCreate">, client: Client) {
        try {
            await client.executeInteraction(interaction);
        } catch (err) {
            Logger.error(err);
        }
    }
}