import { Guild } from "../../../entities/guild-config/guild.js";

export const guildExists = async (guildId: string) => {
    return await Guild.exists({
        where: { id: guildId },
        select: { id: true }
    });
}