import type { CategoryChannel, CommandInteraction } from "discord.js";
import { ApplicationCommandOptionType, ChannelType } from "discord.js";
import { Discord, Guard, Slash, SlashGroup, SlashOption } from "discordx";
import { hasPermission } from "../../../lib/guard/has-permission.js";
import { isGuildRegistered } from "../../../lib/guard/is-guild-registered.js";
import { ticketCategoryCreate } from "../../../database/repositories/tickets/ticket-category/create.js";
import { ticketPanelExistsById } from "../../../database/repositories/tickets/ticket-panel/exists-by-id.js";

type TCategoryChoice = "add" | "remove";

@Discord()
@SlashGroup({ name: "category", description: "Comandos para configuração de categorias." })
@SlashGroup("category")
export class Command {
    @Slash({ name: "add", description: "Adicionar uma nova categoria no painel." })
    @Guard(hasPermission("Administrator"), isGuildRegistered)
    async exec(
        @SlashOption({
            name: "id_panel",
            description: "ID do painel que será recebida a categoria.",
            type: ApplicationCommandOptionType.Number,
            required: true,
            minValue: 0
        }) panelId: number,
        @SlashOption({
            name: "category_name",
            description: "Nome da categoria.",
            type: ApplicationCommandOptionType.String,
            required: true,
            maxLength: 25
        }) categoryName: string,
        @SlashOption({
            name: "emoji",
            description: "Emoji que será utilizado.",
            type: ApplicationCommandOptionType.String,
            required: false
        }) emoji: string,
        @SlashOption({
            name: "guild_category",
            description: "Categoria customizada que ficará os tickets.",
            type: ApplicationCommandOptionType.Channel,
            channelTypes: [ChannelType.GuildCategory],
            required: false
        }) category: CategoryChannel,
        interaction: CommandInteraction
    ) {
        const guildId = interaction.guildId as string;

        if (!await ticketPanelExistsById(guildId, panelId))
            return interaction.reply({
                content: "*❌ Você precisa passar um ID válido de um painel cadastrado nesse servidor.*",
                ephemeral: true
            });

        await ticketCategoryCreate(panelId, categoryName, emoji, category);
        await interaction.reply({
            content: "*✅ Categoria criada nesse painel com sucesso!*",
            ephemeral: true
        });
    }
}