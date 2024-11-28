import type { ButtonInteraction, CommandInteraction, TextChannel, User } from "discord.js";
import type { Ticket } from "../../../database/entities/tickets/ticket.js";
import { Colors, EmbedBuilder } from "discord.js";
import { createTranscript } from "discord-html-transcripts";
import { guildChannelsGet } from "../../../database/repositories/guild-config/guild-channels/get.js";

export const sendTranscripts = async(ticket: Ticket, interaction: ButtonInteraction | CommandInteraction) => {
    const guildId = interaction.guildId as string;
    const channel = interaction.channel as TextChannel;
    const userId = interaction.user.id;
    const ticketMember = interaction.guild?.members.cache.get(ticket.ownerId);

    // Generating transcript
    const transcriptChannelId = await guildChannelsGet(guildId, "transcript");
    const transcriptChannel: TextChannel | undefined = interaction.guild?.channels.cache.get(transcriptChannelId || "") as TextChannel;
    const attachment = await createTranscript(channel, {
        saveImages: true,
        limit: -1,
        poweredBy: false
    });

    const transcriptEmbed = new EmbedBuilder()
        .setColor(Colors.Blue)
        .setDescription(`<@${userId}> Seu transcript será enviado no devido canal e no privado do criador do ticket se possível.`);

    // -- Members of channel
    // -- Getting transcript members
    const actualChannel = interaction.guild?.channels.cache.get(interaction.channelId as string) as TextChannel;
    const listOfIds: Array<string> = [];
    const listOfUsers: Array<User> = [];

    for (const message of actualChannel.messages.cache.values()) {
        const id = message.author.id;

        if (!listOfIds.includes(id)) {
            listOfUsers.push(message.author);
            listOfIds.push(message.author.id);
        }
    };

    let mentionMessage = "";

    for (const user of listOfUsers) {
        mentionMessage += `<@${user.id}> - ${user.username}\n`
    }

    // -- Sending transcript
    const actualDate = Math.floor(Date.now() / 1000);
    const transcriptInfosEmbed = new EmbedBuilder()
        .setAuthor({
            name: ticketMember?.user.username || "Usuário saiu do server",
            iconURL: ticketMember?.avatarURL() || undefined
        })
        .setColor(Colors.Greyple)
        .addFields(
            {
                name: "📋 Dono do ticket",
                value: `<@${ticket.ownerId}>`,
                inline: true
            },
            {
                name: "✍ Nome do ticket",
                value: actualChannel.name as string,
                inline: true
            },
            {
                name: "📁 Nome do painel",
                value: `**${ticket.panel.name || "Indefinido"}**(${ticket.category.name || ticket.baseName})`,
                inline: true
            },
            { name: " ", value: " ", inline: false },
            {
                name: "🔒 Fechado por",
                value: `<@${interaction.user.id}>`,
                inline: true
            },
            {
                name: `📄 Lista de pessoas presentes (${listOfUsers.length} pessoas)`,
                value: mentionMessage,
                inline: true
            },
            {
                name: "📅 Data de criação",
                value: `<t:${actualDate}:f>`,
                inline: true
            }
        )

    if (transcriptChannel) {
        // -- Sending result on the channel
        await transcriptChannel.send({ files: [attachment], embeds: [transcriptInfosEmbed] });

        if (interaction.channel?.isSendable())
            await interaction.channel?.send({
                embeds: [transcriptEmbed]
            });
    }
}