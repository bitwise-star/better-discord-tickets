import { ChannelType } from "discord.js";
import type { Embed, ModalSubmitInteraction } from "discord.js";

export async function handle(interaction: ModalSubmitInteraction) {
    const message = interaction.channel?.messages.cache.get(interaction.fields.getTextInputValue("messageId"));

    if (!message || message.author.id !== interaction.client.user.id)
        return interaction.reply({
            content: "*❌ ID da mensagem é inválido.*",
            ephemeral: true
        });

    const channel = interaction.guild?.channels.cache.get(interaction.fields.getTextInputValue("channelId"));

    if (!channel || channel.type !== ChannelType.GuildText)
        return interaction.reply({
            content: "*❌ Canal de texto não encontrado com esse ID no servidor.*",
            ephemeral: true
        });

    await channel?.send({
        embeds: [interaction.message?.embeds[0] as Embed]
    });

    await interaction.reply({
        content: `*✅ Mensagem enviada no canal ${channel}*`,
        ephemeral: true
    });
}