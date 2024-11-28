import type { TValidRoleKeys } from "../../../entities/guild-config/guild-roles.js";
import { GuildRoles } from "../../../entities/guild-config/guild-roles.js";

export const guildRolesGet = async (guildId: string, toGet: TValidRoleKeys) => {
    const result = await GuildRoles.findOne({
        where: {
            guild: { id: guildId }
        },
        select: {
            id: true,
            [toGet]: true
        }
    });

    return result?.[toGet];
}