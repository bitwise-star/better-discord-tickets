import type { Guild } from "../../../entities/guild-config/guild.js";
import { GuildStaffRoles } from "../../../entities/guild-config/guild-staff-roles.js"

export const createRole = async (roleId: string, guildId: string, canSendMessages?: boolean, mentionOnTickets?: boolean) => {
    const role = new GuildStaffRoles();

    role.roleId = roleId;
    role.guild = { id: guildId } as Guild;
    role.canSendMessages = canSendMessages === undefined ? true : canSendMessages;
    role.mentionOnTickets = mentionOnTickets === undefined ? false : mentionOnTickets;

    return await role.save();
}