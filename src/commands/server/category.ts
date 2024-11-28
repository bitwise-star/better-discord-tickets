import type { CommandInteraction, CategoryChannel } from "discord.js";
import { ApplicationCommandOptionType, ChannelType } from "discord.js";
import { Discord, Guard, Slash, SlashChoice, SlashGroup, SlashOption } from "discordx";
import { hasPermission } from "../../lib/guard/has-permission.js";
import { isGuildRegistered } from "../../lib/guard/is-guild-registered.js";
import type { TValidCategoriesKeys } from "../../database/entities/guild-config/guild-categories.js";
import { guildCategoriesUpdate } from "../../database/repositories/guild-config/guild-categories/update.js";

@Discord()
@SlashGroup({ name: "server", description: "Comandos de configuração do servidor."})
@SlashGroup("server")
export class Category {
    @Slash({ name: "category", description: "Altere uma categoria nas configurações." })
    @Guard(hasPermission("ManageChannels"), isGuildRegistered)
    async exec(
        @SlashChoice(
            { name: "Tickets Abertos", value: "openTickets" },
            { name: "Tickets Fechados", value: "closedTickets" }
        )
        @SlashOption({
            name: "to_change",
            description: "Categoria que será alterada.",
            type: ApplicationCommandOptionType.String,
            required: true
        }) toChange: TValidCategoriesKeys,
        @SlashOption({
            name: "channel",
            description: "Canal que será usado na alteração.",
            type: ApplicationCommandOptionType.Channel,
            required: true,
            channelTypes: [ChannelType.GuildCategory]
        }) channel: CategoryChannel,
        interaction: CommandInteraction
    ) {
        const guildId = interaction.guildId as string;

        await guildCategoriesUpdate(guildId, toChange, channel.id)
        
        await interaction.reply({
            content: "*✅ Atualização realizada com sucesso!*",
            ephemeral: true
        });
    }
}