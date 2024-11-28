import type { GuildMember, TextChannel, ButtonInteraction } from "discord.js";
import { isStaff } from "../../../utils/permission/is-staff.js";
import { ticketGetByChannelId } from "../../../../database/repositories/tickets/ticket/get-by-channel-id.js";
import { ETicketStatus } from "../../../../database/entities/tickets/ticket.js";
import { formatNumberToFourDigits } from "../../../utils/string-utils.js";

export const handle = async (interaction: ButtonInteraction) => {
    const userId = interaction.user.id;

    if (!await isStaff(interaction.member as GuildMember))
        return await interaction.reply({
            content: "*❌ Somente um `staff` tem permissão para utilizar isso.*",
            ephemeral: true
        });
    
    // Ticket data
    const channel = interaction.channel as TextChannel;
    const ticket = await ticketGetByChannelId(channel.id);

    if (!ticket)
        return await interaction.reply({
            content: "*❌ Ocorreu um erro, esse ticket não se encontra mais registrado no banco de dados, contate a desenvolvedora!*",
            ephemeral: true
        });
    
    await (await interaction.deferReply()).delete();

    // Changing
    ticket.baseName = interaction.user.displayName || interaction.user.username;
    await ticket.save();

    const ticketChannel = interaction.guild?.channels.cache.get(ticket.channelId);
    const isOpenEmoji = (ticket.status === ETicketStatus.OPEN) ? "✅-┋" : "❌-┋";

    await ticketChannel?.setName(`${isOpenEmoji}${ticket.baseName}-${formatNumberToFourDigits(ticket.ticketNumber)}`);

    if (interaction.channel?.isSendable())
        await interaction.channel?.send({
            content: `✅ Ticket agora se encontra na posse de <@${userId}>`
        });
}