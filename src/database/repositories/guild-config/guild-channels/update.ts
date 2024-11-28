import type { TValidChannelsKeys } from "../../../entities/guild-config/guild-channels.js";
import { dataSource } from "../../../connection.js";
import { GuildChannels } from "../../../entities/guild-config/guild-channels.js";

export const updateGuildChannels = async (guildId: string, toUpdate: TValidChannelsKeys, channelId: string) => {
    await dataSource.createQueryBuilder()
        .update(GuildChannels)
        .set({ [toUpdate]: channelId })
        .where("guildId=:guildId", { guildId })
        .execute();
}