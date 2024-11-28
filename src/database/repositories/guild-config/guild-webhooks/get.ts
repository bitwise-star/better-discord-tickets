import type { TValidWebhooksKeys } from "../../../entities/guild-config/guild-webhooks.js"
import { GuildWebhooks } from "../../../entities/guild-config/guild-webhooks.js";

export const guildWebhooksGet = async (guildId: string, toGet: TValidWebhooksKeys) => {
    const result = await GuildWebhooks.findOne({
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