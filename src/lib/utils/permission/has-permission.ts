import type { GuildMember, PermissionFlags } from "discord.js";

export const hasPermission = async (member: GuildMember, permission: keyof PermissionFlags) => {
    return member.permissions.has(permission);
}