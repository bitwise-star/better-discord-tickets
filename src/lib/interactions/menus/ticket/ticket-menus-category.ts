import { ChannelType, Colors, EmbedBuilder, PermissionsBitField, type TextChannel, type AnySelectMenuInteraction } from "discord.js";
import { dataSource } from "../../../../database/connection.js";
import { Ticket } from "../../../../database/entities/tickets/ticket.js";
import type { TicketCategory } from "../../../../database/entities/tickets/ticket-category.js";
import { guildCategoriesGet } from "../../../../database/repositories/guild-config/guild-categories/get.js";
import { guildStaffRoleGetAll } from "../../../../database/repositories/guild-config/guild-staff-roles/get-all.js";
import { ticketCategoryGetById } from "../../../../database/repositories/tickets/ticket-category/get-by-id.js";
import { openingTicketRow1, openingTicketRow2 } from "../../../constants/buttons.js";
import { formatNumberToFourDigits, formatPlaceholders } from "../../../utils/string-utils.js";
import type { TPermission } from "../../../utils/types/permissions.js";
import { Logger } from "../../../logger.js";

type TRoleData = {
    id: string,
    allow: Array<bigint>,
    deny: Array<bigint>
}

export const handle = async (interaction: AnySelectMenuInteraction) => {
    const id = Number.parseInt(interaction.values[0]);

    await interaction.message.edit({
        content: interaction.message.content,
        embeds: interaction.message.embeds,
        components: interaction.message.components
    });

    await interaction.deferReply({
        ephemeral: true
    })

    const guildId = interaction.guildId as string;
    const userId = interaction.user.id;

    if (Number.isNaN(id))
        return await interaction.followUp({
            content: "*❌ O tipo de atendimento passado não é válido.*",
            ephemeral: true
        });

    const category = await ticketCategoryGetById(id);

    if (!category || (category && category.panel.guild.id !== guildId))
        return await interaction.followUp({
            content: "*❌ O tipo de atendimento passado não é válido.*",
            ephemeral: true
        });
    
    // getting staff roles
    const permissions: Array<TPermission> = [
        {
            id: guildId,
            deny: [PermissionsBitField.Flags.ViewChannel]
        },
        {
            id: userId,
            allow: [PermissionsBitField.Flags.ViewChannel]
        }
    ];

    const specificRole = interaction.guild?.roles.cache.get(category.specificRoleId || "");
    const staffRoleMentions = [];

    if (!specificRole) {
        const staffRoles = await guildStaffRoleGetAll(guildId);
        
        for (const role of staffRoles) {
            const data: TRoleData = {
                id: role.roleId,
                allow: [ PermissionsBitField.Flags.ViewChannel ],
                deny: []
            };

            role.canSendMessages
                ? data.allow.push(PermissionsBitField.Flags.SendMessages)
                : data.deny.push(PermissionsBitField.Flags.SendMessages);

            permissions.push(data);

            if (role.mentionOnTickets)
                staffRoleMentions.push(`<@&${role.roleId}>`);
        }
    } else {
        permissions.push({
            id: category.specificRoleId,
            allow: [
                PermissionsBitField.Flags.ViewChannel,
                PermissionsBitField.Flags.SendMessages
            ]
        });
    }

    const categoryId = category.guildCategoryId || await guildCategoriesGet(guildId, "openTickets");
    category.count += 1;

    // creating and sending message to channel
    const channel = await interaction.guild?.channels.create({
        name: `✅-┋${category.name}-${formatNumberToFourDigits(category.count)}`,
        type: ChannelType.GuildText,
        permissionOverwrites: permissions,
        parent: categoryId
    }) as TextChannel;

    // -- Embeds
    const embed = new EmbedBuilder()
        .setTitle(`🎟 • Ticket de ${interaction.user.username}`)
        .setDescription("A equipe de suporte estará logo aqui para te atender, aguarde!\nAperte em 🔒 para fechar o ticket.")
        .setColor(Colors.White)
        .setFooter({
            iconURL: interaction.user.avatarURL() || undefined,
            text: interaction.user.id
        });
        
    // -- Sending message on ticket channel
    // - -- getting all staff roles to mention
    const message = await channel?.send({
        content: `${formatPlaceholders(category.panel.message, interaction)} ${specificRole ? `<@&${specificRole}>` : staffRoleMentions.join(" ")}`,
        embeds: [embed],
        components: [openingTicketRow1, openingTicketRow2]
    });
    
    message?.pin()
        .catch((err) => Logger.error(`Cannot pin message; ${err}`));

    // creating user ticket
    const ticket = new Ticket();
    ticket.panel = category?.panel;
    ticket.baseName = category.name;
    ticket.ticketNumber = category.count;
    ticket.ownerId = userId;
    ticket.category = { id } as TicketCategory;
    ticket.channelId = channel?.id as string;

    await dataSource.transaction(async (entityManager) => {
        await entityManager.save(category);
        await entityManager.save(ticket);
    });

    await interaction.followUp({
        content: `*✅ Ticket criado com sucesso <#${channel?.id}>!*`,
        ephemeral: true
    });
}