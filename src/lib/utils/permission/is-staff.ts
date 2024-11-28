import type { GuildMember } from "discord.js";
import { guildStaffRoleGetAll } from "../../../database/repositories/guild-config/guild-staff-roles/get-all.js";

export const isStaff = async (member: GuildMember) => {
    // Verifying for administrator permission
    if (member.permissions.has("Administrator"))
        return true;
    
    // Verifying roles
    const roles = await guildStaffRoleGetAll(member.guild.id);
    let staff = false;

    for (const role of roles) {
        if (!member.roles.cache.has(role.roleId))
            continue;

        staff = true;
        break;
    }

    return staff;
}