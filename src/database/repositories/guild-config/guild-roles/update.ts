import { dataSource } from "../../../connection.js";
import { GuildRoles, type TValidRoleKeys } from "../../../entities/guild-config/guild-roles.js";

export const updateGuildRole = async (guildId: string, roleType: TValidRoleKeys, value: string) => {
    await dataSource.createQueryBuilder()
        .update(GuildRoles)
        .set({ [roleType]: value })
        .where("guildId=:guildId", { guildId })
        .execute();
}