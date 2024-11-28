import type { ColorResolvable, ModalSubmitInteraction } from "discord.js";
import { copyEmbed } from "../../../utils/embed.js";

export async function handle(interaction: ModalSubmitInteraction) {
    const message = interaction.channel?.messages.cache.get(interaction.fields.getTextInputValue("messageId"));

    if (!message || message.author.id !== interaction.client.user.id)
        return interaction.reply({
            content: "*❌ ID da mensagem é inválido.*",
            ephemeral: true
        });

    const copy = await copyEmbed(message.embeds[0]);
    const color = interaction.fields.getTextInputValue("newColor").trim();

    try {
        copy.setColor(color as ColorResolvable || null);
        
        await message.edit({
            embeds: [copy],
            components: message.components
        });

        await interaction.deferReply()
            .then(async (msg) => await msg.delete());
    } catch {
        await interaction.reply({
            content: "*❌ Essa cor é inválida.*",
            ephemeral: true
        });
    }
}