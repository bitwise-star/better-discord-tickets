import type { ButtonInteraction } from "discord.js";

export async function handle(interaction: ButtonInteraction) {
    if (!interaction.memberPermissions?.has("ManageMessages")) return;

    const embed = interaction.message.embeds[0];

    if (!interaction.channel?.isSendable())
        return;

    await interaction.channel?.send({
        embeds: [embed]
    });

    await interaction.reply({
        content: "*✅ Mensagem enviada.*",
        ephemeral: true
    });
}