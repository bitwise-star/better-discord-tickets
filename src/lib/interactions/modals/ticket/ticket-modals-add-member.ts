import type { GuildMember, ModalSubmitInteraction, TextChannel } from "discord.js";
import { isStaff } from "../../../utils/permission/is-staff.js";
import { changeChannelPermissions } from "../../../utils/ticket/ticket-permissions.js";
import { ticketGetByChannelId } from "../../../../database/repositories/tickets/ticket/get-by-channel-id.js";
import { ETicketStatus } from "../../../../database/entities/tickets/ticket.js";

export const handle = async (interaction: ModalSubmitInteraction) => {
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
    
    // Member data
    const memberId = interaction.fields.getTextInputValue("memberId");
    const member = await interaction.guild?.members.fetch(memberId);

    if (!member)
        return await interaction.reply({
            content: `*❌ Nenhum membro de ID \`${memberId}\` foi encontrado.*`,
            ephemeral: true
        });

    await (await interaction.deferReply()).delete();

    // Adding to channel permissions
    await changeChannelPermissions(channel, ticket, ticket.status === ETicketStatus.OPEN, [memberId]);
    await channel.send({
        content: `*✅ <@${memberId}> adicionado ao canal com sucesso por <@${interaction.user.id}>!*`
    });
}