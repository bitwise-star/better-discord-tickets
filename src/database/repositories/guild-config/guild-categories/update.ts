import { dataSource } from "../../../connection.js"
import { GuildCategories } from "../../../entities/guild-config/guild-categories.js"

export type TValidCategoriesKeys = "openTickets" | "closedTickets";

export const guildCategoriesUpdate = async (guildId: string, toSet: TValidCategoriesKeys, categoryId: string) => {
    await dataSource.createQueryBuilder()
        .update(GuildCategories)
        .set({ [toSet]: categoryId })
        .where("guildId=:guildId", { guildId })
        .execute();
}
