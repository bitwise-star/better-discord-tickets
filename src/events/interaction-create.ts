import { Discord, On } from "discordx";
import type { Client, ArgsOf } from "discordx";
import { executeInteraction } from "../lib/handlers/interaction-create.js";

@Discord()
export class InteractionCreateEvent {
    @On({ event: "interactionCreate" })
    async exec([interaction]: ArgsOf<"interactionCreate">, client: Client) {
        if (interaction.isCommand())
            return await client.executeInteraction(interaction);

        if (interaction.isButton())
            return await executeInteraction("buttons", interaction);

        if (interaction.isAnySelectMenu())
            return await executeInteraction("menus", interaction);

        if (interaction.isModalSubmit())
            return await executeInteraction("modals", interaction);
    }
}