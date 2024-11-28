import type { ButtonInteraction, ColorResolvable, CommandInteraction, Guild, TextChannel } from "discord.js";
import type { Ticket } from "../../../database/entities/tickets/ticket.js";
import { EmbedBuilder } from "discord.js";
import { guildChannelsGet } from "../../../database/repositories/guild-config/guild-channels/get.js";
import { Logger } from "../../logger.js";

interface ITicketLogsParams {
    interaction: CommandInteraction | ButtonInteraction,
    color: ColorResolvable,
    action: string,
    ticket: Ticket
}

export const sendToTicketLogsChannel = async ({ interaction, color, action, ticket }: ITicketLogsParams) => {
    const guild = interaction.guild as Guild;
    const guildId = guild.id;
    const user = interaction.user;
    const channel = interaction.channel as TextChannel;
    
    // Logging
    const logsChannelId = await guildChannelsGet(guildId, "logs");
    const logsChannel = guild?.channels.cache.get(logsChannelId || "") as TextChannel;

    if (logsChannel) {
        const logsEmbed = new EmbedBuilder()
            .setAuthor({
                name: user.username,
                iconURL: user.avatarURL() || undefined
            })
            .setColor(color)
            .addFields(
                {
                    name: "Informações",
                    value: `**Ticket:** ${channel.name}\n**Ação:** ${action}`,
                    inline: true
                },
                {
                    name: "Painel de tickets",
                    value: `**${ticket.panel.name}**(${ticket.category.name})`,
                    inline: true
                }
            );

        await logsChannel.send({ embeds: [logsEmbed] })
            .catch((err) => Logger.error(`Error sending logs data: ${err}`));
    }
}