import { Guild } from "../../../entities/guild-config/guild.js"

export const guildGet = async (guildId: string) => {
    return await Guild.findOne({
        where: { id: guildId }
    });
}