import type { GuildMember } from "discord.js";

export const isOnlyAdmin = async (member: GuildMember) => {
    return member.permissions.has("Administrator");
}