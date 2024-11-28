import type { ButtonInteraction, GuildMember, TextChannel } from "discord.js";
import { Colors } from "discord.js";
import { ticketGetByChannelId } from "../../../../database/repositories/tickets/ticket/get-by-channel-id.js";
import { isStaff } from "../../../utils/permission/is-staff.js";
import { sendTranscripts } from "../../../utils/ticket/transcripts.js";
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

    await sendTranscripts(ticket, interaction);

    if (interaction.channel?.isSendable())
        await interaction.channel?.send({
            content: "*✅ Transcript gerado com sucesso!*"
        });

    sendToTicketLogsChannel({
        interaction,
        color: Colors.Blue,
        action: "Gerar cópia",
        ticket
    });
}