import { GuildChannels, type TValidChannelsKeys } from "../../../entities/guild-config/guild-channels.js";

export const guildChannelsGet = async (guildId: string, toGet: TValidChannelsKeys) => {
    const result = await GuildChannels.findOne({
        where: {
            guild: {
                id: guildId
            }
        },
        select: {
            id: true,
            [toGet]: true
        }
    });

    return result?.[toGet];
}