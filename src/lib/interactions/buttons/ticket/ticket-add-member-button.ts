import type { ButtonInteraction, GuildMember, TextChannel } from "discord.js";
import { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import { ticketGetByChannelId } from "../../../../database/repositories/tickets/ticket/get-by-channel-id.js";
import { isStaff } from "../../../utils/permission/is-staff.js";

export const handle = async (interaction: ButtonInteraction) => {
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
    
    // Sending modal to user to get id
    const modal = new ModalBuilder()
        .setCustomId("ticket:modals:add:member")
        .setTitle("Adição de membros no ticket");

    const input = new TextInputBuilder()
        .setCustomId("memberId")
        .setLabel("ID do usuário a ser adicionado.")
        .setStyle(TextInputStyle.Short);

    const row = new ActionRowBuilder<TextInputBuilder>()
        .addComponents(input);
    
    modal.addComponents(row);

    await interaction.showModal(modal);
}