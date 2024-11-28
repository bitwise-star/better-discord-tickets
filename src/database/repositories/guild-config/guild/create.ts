import { Guild } from "../../../entities/guild-config/guild.js";
import { GuildChannels } from "../../../entities/guild-config/guild-channels.js";
import { GuildRoles } from "../../../entities/guild-config/guild-roles.js";
import { dataSource } from "../../../connection.js";
import { GuildCategories } from "../../../entities/guild-config/guild-categories.js";
import { GuildWebhooks } from "../../../entities/guild-config/guild-webhooks.js";

export const createGuild = async (guildId: string) => {
    const guild = new Guild();

    const guildCategories = new GuildCategories();
    const guildWebhooks = new GuildWebhooks();
    const guildChannels = new GuildChannels();
    const guildRoles = new GuildRoles();

    guild.id = guildId;
    guildCategories.guild = guild;
    guildWebhooks.guild = guild;
    guildChannels.guild = guild
    guildRoles.guild = guild;

    await dataSource.transaction(async (entityManager) => {
        await entityManager.save(guild);
        await entityManager.save(guildChannels);
        await entityManager.save(guildRoles);
        await entityManager.save(guildWebhooks);
        await entityManager.save(guildCategories);
    });
}