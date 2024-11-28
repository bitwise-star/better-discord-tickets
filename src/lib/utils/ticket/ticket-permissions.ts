import type { GuildTextBasedChannel } from "discord.js";
import type { Ticket } from "../../../database/entities/tickets/ticket.js";
import type { TPermission } from "../types/permissions.js";
import { ETicketStatus } from "../../../database/entities/tickets/ticket.js";
import { PermissionsBitField } from "discord.js";
import { guildStaffRoleGetAll } from "../../../database/repositories/guild-config/guild-staff-roles/get-all.js";
import { formatNumberToFourDigits } from "../string-utils.js";
import { guildCategoriesGet } from "../../../database/repositories/guild-config/guild-categories/get.js";

export const changeChannelPermissions = async (
    channel: GuildTextBasedChannel,
    ticket: Ticket,
    open: boolean,
    extraIds?: Array<string>
) => {
    const guildId = channel.guildId as string;

    const permissions: Array<TPermission> = [
        {
            id: guildId,
            deny: [PermissionsBitField.Flags.ViewChannel]
        },
        {
            id: ticket.ownerId,
            deny: [],
            allow: [PermissionsBitField.Flags.ViewChannel]
        }    
    ];

    const specificRole = channel.guild?.roles.cache.get(ticket.category.specificRoleId || "");
    const rolesIds = [ticket.category.specificRoleId];

    (open)
        ? permissions[1].allow?.push(PermissionsBitField.Flags.SendMessages)
        : permissions[1].deny?.push(PermissionsBitField.Flags.SendMessages);
    
    if (!specificRole) {
        const roles = await guildStaffRoleGetAll(guildId);

        for (const role of roles) {
            rolesIds.push(role.roleId);
            permissions.push({
                id: role.roleId,
                allow: [PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ViewChannel]
            });
        }
    } else {
        permissions.push({
            id: ticket.category.specificRoleId,
            allow: [PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ViewChannel]
        });
    }

    // Verify if exists other people
    for (const id of extraIds || []) {
        if (rolesIds.includes(id) || id === ticket.ownerId || id === guildId) break;

        const perm: TPermission = {
            id,
            allow: [PermissionsBitField.Flags.ViewChannel],
            deny: []
        };

        if (open) {
            perm.allow?.push(PermissionsBitField.Flags.SendMessages);
        } else {
            perm.deny?.push(PermissionsBitField.Flags.SendMessages);
        }

        permissions.push(perm);
    }

    // Editing channel permissions
    const getChannel = await channel.guild.channels.fetch(channel.id);

    const name = `${(open) ? "✅" : "❌"}-┋${ticket.baseName}-${formatNumberToFourDigits(ticket.ticketNumber)}`;
    const parent = (ticket.status === ETicketStatus.CLOSED)
                    ? await guildCategoriesGet(guildId, "closedTickets") || getChannel?.parentId
                    : (ticket.category.guildCategoryId)
                        ? ticket.category.guildCategoryId
                        : await guildCategoriesGet(guildId, "openTickets");

    if (name === getChannel?.name) {
        await getChannel?.edit({
            permissionOverwrites: permissions,
            parent: parent
        });
    } else {
        await getChannel?.edit({
            permissionOverwrites: permissions,
            parent: parent,
            name: name
        });
    }
}