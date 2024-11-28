import type { CommandInteraction } from "discord.js";
import type { GuardFunction } from "discordx";
import { guildExists } from "../../database/repositories/guild-config/guild/exists.js";

export const isGuildRegistered: GuardFunction<CommandInteraction> = async (interaction, _, next) => {
    const guildId = interaction.guildId as string;

    if (!await guildExists(guildId))
        return await interaction.reply({
            content: "*❌ The server is not setup. Execute the `/setup` first.*",
            ephemeral: true
        });

    await next();
};