import type { ButtonInteraction, GuildMember, TextChannel } from "discord.js";
import { isStaff } from "../../../utils/permission/is-staff.js";
import { Colors, EmbedBuilder } from "discord.js";
import { ticketGetByChannelId } from "../../../../database/repositories/tickets/ticket/get-by-channel-id.js";
import { ETicketStatus } from "../../../../database/entities/tickets/ticket.js";
import { Logger } from "../../../logger.js";
import { sendToTicketLogsChannel } from "../../../utils/ticket/send-to-logs-channel.js";
import { sendMessageIntoDM } from "../../../utils/ticket/direct-message.js";

export const handle = async (interaction: ButtonInteraction) => {
    const ticketChannel = interaction.channel as TextChannel;
    const ticket = await ticketGetByChannelId(ticketChannel.id);

    if (!await isStaff(interaction.member as GuildMember))
        return await interaction.reply({
            content: "*❌ Somente um `staff` tem permissão para utilizar isso.*",
            ephemeral: true
        });

    if (!ticket)
        return await interaction.reply({
            content: "*❌ Ocorreu um erro, esse ticket não se encontra mais registrado no banco de dados, contate a desenvolvedora se isso for um problema!*",
            ephemeral: true
        });

    if (ticket.status === ETicketStatus.CLOSED)
        return await interaction.reply({
            content: "*❌ Não é possível avisar um membro de seu ticket sendo que o mesmo se encontra fechado.*",
            ephemeral: true
        });

    const member = await interaction.guild?.members.fetch(ticket.ownerId);

    if (!member)
        return await interaction.reply({
            content: "*❌ Esse membro não foi encontrado no servidor, não foi possível mandar a mensagem de alerta. Caso ache que isso foi um erro, use o comando* `/avisar`",
            ephemeral: true
        });

    await (await interaction.deferReply()).delete();

    const channel = (ticketChannel) ? ticketChannel : interaction.channel as TextChannel;
        
    const embed = new EmbedBuilder()
        .setTitle("❗ • Notificação de ticket")
        .setDescription("Você está sendo requisitado em um ticket no qual abriu recentemente, entre no canal abaixo e converse com a nossa equipe para que seja possível solucionar o seu problema.")
        .setColor(Colors.White)
        .addFields(
            {
                name: "👤 Staff que mencionou",
                value: `<@${interaction.user.id}>`,
                inline: true
            },
            {
                name: "💬 Ticket",
                value: `${channel}`,
                inline: true
            }
        )
        .setTimestamp(Date.now());

    await sendMessageIntoDM(interaction, member, {
        content: `${member}`,
        embeds: [embed] 
    })
    .then(async () => {
        if (interaction.channel?.isSendable())
            await interaction.channel?.send({
                content: "*✅ Aviso enviado com sucesso!*"
            });
    })
    .catch(async (err) => Logger.error(err));

    sendToTicketLogsChannel({
        interaction,
        color: Colors.Orange,
        action: "Avisar membro",
        ticket
    });
}