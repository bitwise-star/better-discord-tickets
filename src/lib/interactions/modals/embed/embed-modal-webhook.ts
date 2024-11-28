import { WebhookClient } from "discord.js";
import type { ModalSubmitInteraction } from "discord.js";

export async function handle(interaction: ModalSubmitInteraction) {
    try {
        const message = interaction.channel?.messages.cache.get(interaction.fields.getTextInputValue("messageId"));

        if (!message || message.author.id !== interaction.client.user.id)
            return interaction.reply({
                content: "*❌ ID da mensagem é inválido.*",
                ephemeral: true
            });

        const webclient = new WebhookClient({
            url: interaction.fields.getTextInputValue("webhookURL")
        });

        await webclient.send({
            embeds: [message.embeds[0]]
        });

        await interaction.reply({
            content: "*✅ Mensagem por webhook enviada com sucesso!*",
            ephemeral: true
        });
    } catch {
        await interaction.reply({
            content: "*❌ Não foi possível enviar o embed pela webhook com essa URL, verifique se a URL é válida e tente novamente.*",
            ephemeral: true
        })
    }
}