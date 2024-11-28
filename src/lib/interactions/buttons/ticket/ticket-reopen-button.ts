import type { ButtonInteraction, GuildMember, TextChannel } from "discord.js";
import { Colors, EmbedBuilder } from "discord.js";
import { isStaff } from "../../../utils/permission/is-staff.js";
import { Logger } from "../../../logger.js";
import { ticketGetByChannelId } from "../../../../database/repositories/tickets/ticket/get-by-channel-id.js";
import { ETicketStatus } from "../../../../database/entities/tickets/ticket.js";
import { changeChannelPermissions } from "../../../utils/ticket/ticket-permissions.js";
import { sendToTicketLogsChannel } from "../../../utils/ticket/send-to-logs-channel.js";

export const handle = async (interaction: ButtonInteraction) => {
    if (!await isStaff(interaction.member as GuildMember))
        return await interaction.reply({
            content: "*❌ Somente um `staff` tem permissão para utilizar isso.*",
            ephemeral: true
        });

    const channel = interaction.channel as TextChannel;
    const ticket = await ticketGetByChannelId(channel.id);

    if (!ticket)
        return await interaction.reply({
            content: "*❌ Ocorreu um erro, esse ticket não se encontra mais registrado no banco de dados, contate a desenvolvedora!*",
            ephemeral: true
        });
    
    if (ticket.status === ETicketStatus.OPEN)
        return await interaction.reply({
            content: "*❌ Esse ticket já se encontra fechado.*",
            ephemeral: true
        });

    await (await interaction.deferReply()).delete()

    ticket.status = ETicketStatus.OPEN;
    await ticket.save();

    const embed = new EmbedBuilder()
        .setDescription(`Ticket reaberto por <@${interaction.user.id}>.`)
        .setColor(Colors.Green);

    if (interaction.channel?.isSendable())
        await interaction.channel?.send({
            embeds: [embed]
        });

    await interaction.message.delete()
        .catch((err) => Logger.error(err));

    sendToTicketLogsChannel({
        interaction,
        color: Colors.Green,
        action: "Reabrir",
        ticket
    });

    const roles = [];

    for (const [id, _] of channel.permissionOverwrites.valueOf()) {
        roles.push(id);
    }

    await changeChannelPermissions(channel, ticket, true, roles);
}