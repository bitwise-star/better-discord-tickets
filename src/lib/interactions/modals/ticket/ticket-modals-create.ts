import type { TPermission } from "../../../utils/types/permissions.js";
import type { TicketCategory } from "../../../../database/entities/tickets/ticket-category.js";
import type { ModalSubmitInteraction, TextChannel } from "discord.js";
import { ChannelType, Colors, EmbedBuilder, PermissionsBitField } from "discord.js";
import { dataSource } from "../../../../database/connection.js";
import { Ticket } from "../../../../database/entities/tickets/ticket.js";
import { guildCategoriesGet } from "../../../../database/repositories/guild-config/guild-categories/get.js";
import { guildStaffRoleGetAll } from "../../../../database/repositories/guild-config/guild-staff-roles/get-all.js";
import { ticketCategoryGetById } from "../../../../database/repositories/tickets/ticket-category/get-by-id.js";
import { formatNumberToFourDigits, formatPlaceholders } from "../../../utils/string-utils.js";
import { Logger } from "../../../logger.js";
import { openingTicketRow1, openingTicketRow2 } from "../../../constants/buttons.js";

export const handle = async (interaction: ModalSubmitInteraction) => {
    await interaction.deferReply({
        ephemeral: true
    })

    const guildId = interaction.guildId as string;
    const userId = interaction.user.id;

    // getting the category by the id (value of the selected option on menu)
    const fields = interaction.fields;
    const values = {
        id: fields.getTextInputValue("category_id"),
        name: fields.getTextInputValue("name"),
        boot: fields.getTextInputValue("boot"),
        charid: fields.getTextInputValue("charid")
    }

    const id = Number.parseInt(values.id);

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

    if (!specificRole) {
        const staffRoles = await guildStaffRoleGetAll(guildId);
        
        for (const role of staffRoles) {
            permissions.push({
                id: role.roleId,
                allow: [
                    PermissionsBitField.Flags.ViewChannel,
                    PermissionsBitField.Flags.SendMessages
                ]
            });
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
        .setDescription("Você será atendido logo, aguarde.\nAperte em 🔒 para fechar o ticket.")
        .setColor(Colors.Gold)
        .setFooter({
            iconURL: interaction.user.avatarURL() || undefined,
            text: interaction.user.id
        });
        
    // -- Sending message on ticket channel
    const message = await channel?.send({
        content: formatPlaceholders(category.panel.message, interaction),
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
    ticket.category = { id: Number.parseInt(values.id) } as TicketCategory;
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