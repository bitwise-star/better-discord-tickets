import type { CommandInteraction } from "discord.js";
import { ApplicationCommandOptionType } from "discord.js";
import { Discord, Guard, Slash, SlashGroup, SlashOption } from "discordx";
import { hasPermission } from "../../../lib/guard/has-permission.js";
import { isGuildRegistered } from "../../../lib/guard/is-guild-registered.js";
import { ticketPanelExistsById } from "../../../database/repositories/tickets/ticket-panel/exists-by-id.js";
import { ticketPanelRemove } from "../../../database/repositories/tickets/ticket-panel/remove.js";

@Discord()
@SlashGroup("panel")
export class Command {
    @Slash({ name: "remove", description: "Remova um painel desse servidor." })
    @Guard(hasPermission("Administrator"), isGuildRegistered)
    async exec(
        @SlashOption({
            name: "panel_id",
            description: "Id do painel que será removido do seu servidor.",
            type: ApplicationCommandOptionType.Number,
            required: true,
            minValue: 0
        }) panelId: number,
        interaction: CommandInteraction
    ) {
        const guildId = interaction.guildId as string;

        if (!await ticketPanelExistsById(guildId, panelId))
            return await interaction.reply({
                content: "*❌ Esse painel não existe no seu servidor.*",
                ephemeral: true
            });

        await ticketPanelRemove(panelId);
        await interaction.reply({
            content: "*✅ Painel removido do seu servidor com sucesso!*",
            ephemeral: true
        });
    }
}