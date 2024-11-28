import { Colors, EmbedBuilder, type CommandInteraction } from "discord.js";
import { Discord, Guard, Slash, SlashGroup } from "discordx";
import { hasPermission } from "../../../lib/guard/has-permission.js";
import { isGuildRegistered } from "../../../lib/guard/is-guild-registered.js";
import { ticketPanelGetAll } from "../../../database/repositories/tickets/ticket-panel/get.js";

@Discord()
@SlashGroup("panel")
export class Command {
    @Slash({ name: "list", description: "Liste todos os painéis existentes." })
    @Guard(hasPermission("Administrator"), isGuildRegistered)
    async exec(interaction: CommandInteraction) {
        const guildId = interaction.guildId as string;
        const panels = await ticketPanelGetAll(guildId);

        let description = (panels.length === 0)
            ? "Nenhum painel encontrado"
            : "";
        
        for (const panel of panels) {
            description += ` \`ID: ${panel.id}\` - ${panel.name}\n`;
        }

        const embed = new EmbedBuilder()
            .setTitle("📋 • Painéis de tickets cadastrados")
            .setColor(Colors.Gold)
            .setDescription(description)
            .setFooter({ text: interaction.user.id });

        await interaction.reply({
            embeds: [embed],
            ephemeral: true
        });
    }
}