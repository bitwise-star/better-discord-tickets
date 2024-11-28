import type { ButtonInteraction, GuildMember, TextChannel } from "discord.js";
import { Colors, EmbedBuilder } from "discord.js";
import { ticketGetByChannelId } from "../../../../database/repositories/tickets/ticket/get-by-channel-id.js";
import { isStaff } from "../../../utils/permission/is-staff.js";
import { Logger } from "../../../logger.js";
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

    await (await interaction.deferReply()).delete();
    
    const embed = new EmbedBuilder()
        .setDescription("Ticket está sendo excluído em 5 segundos...")
        .setColor(Colors.Red);
    
    if (interaction.channel?.isSendable())
        await interaction.channel?.send({
            embeds: [embed]
        });;
    
    await interaction.message.delete()
        .catch((err) => Logger.error(err));
    
        setTimeout(async () => {
        await interaction.channel?.delete()
            .then(async () => await ticket.remove());
    }, 5000);

    sendToTicketLogsChannel({
        interaction,
        color: Colors.Red,
        action: "Deletar",
        ticket
    });   
}