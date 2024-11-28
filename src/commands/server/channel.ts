import type { TValidChannelsKeys } from "../../database/entities/guild-config/guild-channels.js";
import type { CommandInteraction, TextChannel } from "discord.js";
import { ApplicationCommandOptionType, ChannelType } from "discord.js";
import { Discord, Guard, Slash, SlashChoice, SlashGroup, SlashOption } from "discordx";
import { hasPermission } from "../../lib/guard/has-permission.js";
import { isGuildRegistered } from "../../lib/guard/is-guild-registered.js";
import { updateGuildChannels } from "../../database/repositories/guild-config/guild-channels/update.js";

@Discord()
@SlashGroup("server")
export class Command {
    @Slash({ name: "channel", description: "Defina um novo canal nas configurações do servidor." })
    @Guard(hasPermission("ManageChannels"), isGuildRegistered)
    async exec(
        @SlashChoice(
            { name: "Transcripts", value: "transcript"},
            { name: "Logs", value: "logs" }
        )
        @SlashOption({
            name: "to_change",
            description: "Canal que será alterado na configuração.",
            type: ApplicationCommandOptionType.String,
            required: true
        }) toChange: TValidChannelsKeys,
        @SlashOption({
            name: "channel",
            description: "Novo canal a ser atrinbuído a essa configuração.",
            type: ApplicationCommandOptionType.Channel,
            required: true,
            channelTypes: [ChannelType.GuildText]
        }) channel:TextChannel,
        interaction: CommandInteraction
    ) {
        const guildId = interaction.guildId as string;

        await updateGuildChannels(guildId, toChange, channel.id);
        await interaction.reply({
            content: "*✅ Configuração setada com sucesso.*",
            ephemeral: true
        });
    }
}