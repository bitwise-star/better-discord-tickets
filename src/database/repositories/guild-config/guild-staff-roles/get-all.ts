import { GuildStaffRoles } from "../../../entities/guild-config/guild-staff-roles.js"

export const guildStaffRoleGetAll = async (guildId: string) => {
    return await GuildStaffRoles.find({
        where: {
            guild: { id: guildId }
        }
    });
}