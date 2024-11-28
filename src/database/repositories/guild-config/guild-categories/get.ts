import type { TValidCategoriesKeys } from "../../../entities/guild-config/guild-categories.js";
import { GuildCategories } from "../../../entities/guild-config/guild-categories.js"

export const guildCategoriesGet = async (guildId: string, toGet: TValidCategoriesKeys) => {
    const result = await GuildCategories.findOne({
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