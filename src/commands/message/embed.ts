import type { CommandInteraction } from "discord.js";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } from 'discord.js';
import { Discord, Guard, Slash } from "discordx";
import { hasPermission } from "../../lib/guard/has-permission.js";

@Discord()
export class Command {
    @Slash({ name: "embed", description: "Crie seu próprio embed." })
    @Guard(hasPermission("ManageMessages"))
    async exec(interaction: CommandInteraction) {
        const embed = new EmbedBuilder()
            .setTitle("Título do seu embed")
            .setColor("#FFFFFF")
            .setDescription("Descrição do seu embed");

        const row1 = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("embed:title")
                    .setLabel("Título")
                    .setEmoji("✍")
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId("embed:description")
                    .setLabel("Descrição")
                    .setEmoji("📃")
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId("embed:footer")
                    .setLabel("Rodapé")
                    .setEmoji("📝")
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId("embed:color")
                    .setLabel("Cor")
                    .setEmoji("🎨")
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId("embed:image")
                    .setLabel("Imagem")
                    .setEmoji("🖼")
                    .setStyle(ButtonStyle.Primary)
            );

        const row2 = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("embed:send:here")
                    .setLabel("Enviar aqui")
                    .setEmoji("💬")
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId("embed:send:webhook")
                    .setLabel("Webhook")
                    .setEmoji("🌐")
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId("embed:send:other")
                    .setLabel("Outro canal")
                    .setEmoji("↪")
                    .setStyle(ButtonStyle.Success)
            );

        await interaction.reply({
            embeds: [embed],
            components: [row1, row2]
        });
    }
}