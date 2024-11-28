import type { ModalSubmitInteraction } from "discord.js";
import { copyEmbed } from "../../../utils/embed.js";

export async function handle(interaction: ModalSubmitInteraction) {
    const message = interaction.channel?.messages.cache.get(interaction.fields.getTextInputValue("messageId"));

    if (!message || message.author.id !== interaction.client.user.id)
        return interaction.reply({
            content: "*❌ ID da mensagem é inválido.*",
            ephemeral: true
        });

    try {
        const copy = await copyEmbed(message.embeds[0]);
        const avatar = interaction.fields.getTextInputValue("footerAvatar").trim();
        const text = interaction.fields.getTextInputValue("footerText").trim();

        copy.setFooter({
            iconURL: avatar || undefined,
            text: text || ""
        });
        
        await message.edit({
            embeds: [copy],
            components: message.components
        });

        await interaction.deferReply()
            .then(async (msg) => await msg.delete());
    } catch {
        await interaction.reply({
            content: "*❌ Verifique a imagem passada e tente novamente, a URL pode estar inválida.*",
            ephemeral: true
        });
    }
}