import { GuildCategories } from "../../../entities/guild-config/guild-categories.js"

export const guildCategoriesGetAll = async (guildId: string) => {
    return await GuildCategories.findOne({
        where: {
            guild: { id: guildId }
        }
    });
}