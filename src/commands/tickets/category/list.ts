import { ApplicationCommandOptionType, Colors, EmbedBuilder, type CommandInteraction } from "discord.js";
import { Discord, Guard, Slash, SlashGroup, SlashOption } from "discordx";
import { hasPermission } from "../../../lib/guard/has-permission.js";
import { isGuildRegistered } from "../../../lib/guard/is-guild-registered.js";
import { ticketPanelExistsById } from "../../../database/repositories/tickets/ticket-panel/exists-by-id.js";
import { ticketCategoryGetAll } from "../../../database/repositories/tickets/ticket-category/get-all.js";

@Discord()
@SlashGroup("category")
export class Command {
    @Slash({ name: "list", description: "Liste todos os painéis existentes." })
    @Guard(hasPermission("Administrator"), isGuildRegistered)
    async exec(
        @SlashOption({
            name: "id_panel",
            description: "ID do painel que será recebida a categoria.",
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

        const categories = await ticketCategoryGetAll(panelId);

        let description = (categories.length === 0)
            ? "Nenhuma categoria encontrado nesse painel"
            : "";
        
        for (const category of categories) {
            description += ` \`ID: ${category.id}\` - ${category.name}\n`;
        }

        const embed = new EmbedBuilder()
            .setTitle("📋 • Categorias de tickets cadastrados")
            .setColor(Colors.Gold)
            .setDescription(description)
            .setFooter({ text: interaction.user.id });

        await interaction.reply({
            embeds: [embed],
            ephemeral: true
        });
    }
}