import type { ModalSubmitInteraction } from "discord.js";
import { copyEmbed } from "../../../utils/embed.js";

export async function handle(interaction: ModalSubmitInteraction) {
    const message = interaction.channel?.messages.cache.get(interaction.fields.getTextInputValue("messageId"));

    if (!message || message.author.id !== interaction.client.user.id)
        return interaction.reply({
            content: "*❌ ID da mensagem é inválido.*",
            ephemeral: true
        });

    const copy = await copyEmbed(message.embeds[0]);
    const description = interaction.fields.getTextInputValue("newDescription").trim();

    copy.setDescription(description || null);
    
    await message.edit({
        embeds: [copy],
        components: message.components
    });

    await interaction.deferReply()
        .then(async (msg) => await msg.delete());
}