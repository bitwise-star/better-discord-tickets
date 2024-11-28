import { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, WebhookClient } from "discord.js";
import type { ButtonInteraction } from "discord.js";

export async function handle(interaction: ButtonInteraction) {
    if (!interaction.memberPermissions?.has("ManageMessages")) return;

    const modal = new ModalBuilder()
        .setCustomId("embed:modal:webhook")
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
                .setCustomId("webhookURL")
                .setLabel("URL da webhook")
                .setStyle(TextInputStyle.Short)
                .setRequired(true)
        );

    modal.addComponents(row1, row2);
    await interaction.showModal(modal);
}