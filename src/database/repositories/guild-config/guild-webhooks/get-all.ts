import { GuildWebhooks } from "../../../entities/guild-config/guild-webhooks.js"

export const guildWebhooksGetAll = async (guildId: string) => {
    return await GuildWebhooks.findOne({
        where: {
            guild: { id: guildId }
        }
    });
}