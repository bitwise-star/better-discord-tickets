import type { CommandInteraction, TextChannel } from "discord.js";
import { ApplicationCommandOptionType, ChannelType } from "discord.js";
import { Discord, Guard, Slash, SlashGroup, SlashOption } from "discordx";
import { hasPermission } from "../../lib/guard/has-permission.js";
import { updateGuildChannels } from "../../database/repositories/guild-config/guild-channels/update.js";
import { createGuild } from "../../database/repositories/guild-config/guild/create.js";
import { guildExists } from "../../database/repositories/guild-config/guild/exists.js";

@Discord()
@SlashGroup("server")
export class Command {
    @Slash({ name: "setup", description: "Realize a configuração inicial do seu servidor." })
    @Guard(hasPermission("Administrator"))
    async exec(
        @SlashOption({
            name: "transcript_channel",
            description: "Canal destinado aos transcripts",
            type: ApplicationCommandOptionType.Channel,
            channelTypes: [ChannelType.GuildText],
            required: true
        }) transcriptChannel: TextChannel,
        interaction: CommandInteraction
    ) {
        const guildId = interaction.guildId as string;

        if (await guildExists(guildId))
            return await interaction.reply({
                content: "❌ *Seu servidor já se encontra registrado.*",
                ephemeral: true
            });

        await createGuild(guildId);
        await updateGuildChannels(guildId, "transcript", transcriptChannel.id);

        return await interaction.reply({
            content: "✅ *Server registrado com sucesso.*",
            ephemeral: true
        });
    }
}