import { GuildStaffRoles } from "../../../entities/guild-config/guild-staff-roles.js"

export const guildStaffRoleExists = async (roleId: string) => {
    return await GuildStaffRoles.exists({
        where: { roleId }
    });
}