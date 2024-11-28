import { ApplicationCommandOptionType, type TextChannel, type CommandInteraction } from "discord.js";
import { Discord, Guard, Slash, SlashOption } from "discordx";
import { hasPermission } from "../../lib/guard/has-permission.js";

@Discord()
export class Command {
    @Slash({ name: "clear", description: "Limpe as mensagens de um canal." })
    @Guard(hasPermission("ManageMessages"))
    async exec(
        @SlashOption({
            name: "quantity",
            description: "Quantidade de mensagens a serem removidas.",
            type: ApplicationCommandOptionType.Number,
            minValue: 1,
            maxValue: 1000,
            required: true
        }) quantity: number,
        interaction: CommandInteraction
    ) {
        await interaction.deferReply({ ephemeral: true });

        const channel = interaction.channel as TextChannel;
        let remaining = quantity;

        const deleteMessages = async () => {
            const fetchLimit = Math.min(remaining, 100);
            const messages = await channel.messages.fetch({ limit: fetchLimit });

            const recentMessages = messages.filter(
                msg => Date.now() - msg.createdTimestamp < 14 * 24 * 60 * 60 * 1000
            );

            if (recentMessages.size > 0) {
                await channel.bulkDelete(recentMessages).catch(() => { return });
                remaining -= recentMessages.size;

                if (remaining > 0) {
                    setTimeout(deleteMessages, 2000);
                } else {
                    await interaction.followUp(`🗑 Foram apagadas ${quantity} mensagens.`);
                }
            } else if (remaining > 0) {
                await interaction.followUp("🗑 Algumas mensagens não puderam ser apagadas já que possuem mais de 14 dias.");
            }
        };

        deleteMessages();
    }
}
