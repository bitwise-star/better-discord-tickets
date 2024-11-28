import { dataSource } from "../../../connection.js";
import { GuildStaffRoles } from "../../../entities/guild-config/guild-staff-roles.js";

export const guildStaffRoleRemove = async (roleId: string) => {
    await dataSource.createQueryBuilder()
        .delete()
        .from(GuildStaffRoles)
        .where("roleId=:roleId", { roleId })
        .execute();
}