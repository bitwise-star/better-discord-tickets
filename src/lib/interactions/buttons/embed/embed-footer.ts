import { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import type { ButtonInteraction } from "discord.js";

export async function handle(interaction: ButtonInteraction) {
    if (!interaction.memberPermissions?.has("ManageMessages")) return;
    
    const modal = new ModalBuilder()
        .setCustomId("embed:modal:footer")
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
                .setCustomId("footerAvatar")
                .setLabel("Foto do rodapé")
                .setStyle(TextInputStyle.Short)
                .setValue(interaction.message.embeds[0].footer?.iconURL || "")
                .setRequired(false),
        );

    const row3 = new ActionRowBuilder<TextInputBuilder>()
        .addComponents(
            new TextInputBuilder()
                .setCustomId("footerText")
                .setLabel("Texto do rodapé")
                .setStyle(TextInputStyle.Short)
                .setMaxLength(2048)
                .setValue(interaction.message.embeds[0].footer?.text || "")
                .setRequired(false),
        );

    modal.addComponents(row1, row2, row3);
    
    await interaction.showModal(modal);
}