import { Colors, EmbedBuilder, type ButtonInteraction, type CommandInteraction, type GuildMember, type TextChannel } from "discord.js";
import { isStaff } from "../utils/permission/is-staff.js";
import { ticketGetByChannelId } from "../../database/repositories/tickets/ticket/get-by-channel-id.js";
import { ETicketStatus } from "../../database/entities/tickets/ticket.js";
import { sendTranscripts } from "../utils/ticket/transcripts.js";
import { adminPanelEmbed } from "../constants/embeds.js";
import { closingTicketRow } from "../constants/buttons.js";
import { sendToTicketLogsChannel } from "../utils/ticket/send-to-logs-channel.js";
import { changeChannelPermissions } from "../utils/ticket/ticket-permissions.js";

export const closeTicket = async (interaction: CommandInteraction | ButtonInteraction) => {
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
    
    if (ticket.status === ETicketStatus.CLOSED)
        return await interaction.reply({
            content: "*❌ Esse ticket já se encontra fechado.*",
            ephemeral: true
        });

    await (await interaction.deferReply()).delete();

    // Closed embed
    const closedEmbed = new EmbedBuilder()
        .setDescription(`Ticket fechado por <@${userId}>.`)
        .setColor(Colors.Yellow);

    await sendTranscripts(ticket, interaction);

    // Updating ticket
    ticket.status = ETicketStatus.CLOSED;
    await ticket.save();
    
    if (interaction.channel?.isSendable())
        await interaction.channel?.send({
            embeds: [closedEmbed, adminPanelEmbed],
            components: [closingTicketRow]
        });

    sendToTicketLogsChannel({
        interaction,
        color: Colors.Yellow,
        action: "Fechar",
        ticket
    });

    const roles = [];

    for (const [id, _] of channel.permissionOverwrites.valueOf()) {
        roles.push(id);
    }    

    await changeChannelPermissions(channel, ticket, false, roles);
}