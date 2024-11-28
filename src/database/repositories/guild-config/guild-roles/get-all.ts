import { GuildRoles } from "../../../entities/guild-config/guild-roles.js"

export const findGuildRolesGetAll = async (guildId: string) => {
    return await GuildRoles.findOne({
        where: { guild: { id: guildId }}
    });
}