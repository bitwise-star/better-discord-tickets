import { dataSource } from "../../../connection.js";
import { GuildWebhooks, type TValidWebhooksKeys } from "../../../entities/guild-config/guild-webhooks.js";

export const guildWebhooksUpdate = async (guildId: string, toChange: TValidWebhooksKeys, webhook: string) => {
    await dataSource.createQueryBuilder()
        .update(GuildWebhooks)
        .set({ [toChange]: webhook })
        .where("guildId=:guildId", { guildId })
        .execute();
}