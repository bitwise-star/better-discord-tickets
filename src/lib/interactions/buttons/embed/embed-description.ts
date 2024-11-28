import { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import type { ButtonInteraction } from "discord.js";

export async function handle(interaction: ButtonInteraction) {
    if (!interaction.memberPermissions?.has("ManageMessages")) return;

    const modal = new ModalBuilder()
        .setCustomId("embed:modal:description")
        .setTitle("Editor de embed");

    const row1 = new ActionRowBuilder<TextInputBuilder>()
        .addComponents(
            new TextInputBuilder()
                .setCustomId("messageId")
                .setLabel("ID da mensagem")
                .setStyle(TextInputStyle.Short)
                .setValue(interaction.message.id)
                .setRequired(true)
        );

    const row2 = new ActionRowBuilder<TextInputBuilder>()
        .addComponents(
            new TextInputBuilder()
                .setCustomId("newDescription")
                .setLabel("Nova descrição do embed")
                .setStyle(TextInputStyle.Paragraph)
                .setMaxLength(4000)
                .setValue(interaction.message.embeds[0].description || "")
                .setRequired(false)
        );

    modal.addComponents(row1, row2);
    await interaction.showModal(modal);
}