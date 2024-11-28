import type { CommandInteraction } from "discord.js";
import { ApplicationCommandOptionType } from "discord.js";
import { Discord, Guard, Slash, SlashGroup, SlashOption } from "discordx";
import { hasPermission } from "../../../lib/guard/has-permission.js";
import { isGuildRegistered } from "../../../lib/guard/is-guild-registered.js";
import { ticketPanelExistsById } from "../../../database/repositories/tickets/ticket-panel/exists-by-id.js";
import { ticketCategoryExistsById } from "../../../database/repositories/tickets/ticket-category/exists-by-id.js";
import { ticketCategoryRemove } from "../../../database/repositories/tickets/ticket-category/remove.js";

@Discord()
@SlashGroup("category")
export class Command {
    @Slash({ name: "remove", description: "Remova uma categoria de um painel."})
    @Guard(hasPermission("Administrator"), isGuildRegistered)
    async exec(
        @SlashOption({
            name: "panel_id",
            description: "ID do painel que será removida a categoria.",
            type: ApplicationCommandOptionType.Number,
            minValue: 0,
            required: true
        }) panelId: number,
        @SlashOption({
            name: "category_id",
            description: "ID da categoria que será removida do painel.",
            type: ApplicationCommandOptionType.Number,
            minValue: 0,
            required: true
        }) categoryId: number,
        interaction: CommandInteraction
    ) {
        const guildId = interaction.guildId as string;

        if (!await ticketPanelExistsById(guildId, panelId))
            return await interaction.reply({
                content: "*❌ Não foi possível encontrar um painel com esse ID no seu servidor.*",
                ephemeral: true
            });

        if (!await ticketCategoryExistsById(panelId, categoryId))
            return await interaction.reply({
                content: "*❌ Não foi possível encontrar uma categoria nesse painel que possua esse ID.*",
                ephemeral: true
            });

        await ticketCategoryRemove(categoryId);
        await interaction.reply({
            content: "*✅ Categoria removida com sucesso desse painel.*",
            ephemeral: true
        });
    }
}