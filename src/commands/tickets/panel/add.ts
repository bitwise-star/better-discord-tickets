import type { CommandInteraction } from "discord.js";
import { ApplicationCommandOptionType } from "discord.js";
import { Discord, Guard, Slash, SlashGroup, SlashOption } from "discordx";
import { hasPermission } from "../../../lib/guard/has-permission.js";
import { isGuildRegistered } from "../../../lib/guard/is-guild-registered.js";
import { ticketPanelExistsByName } from "../../../database/repositories/tickets/ticket-panel/exists-by-name.js";
import { ticketPanelCreate } from "../../../database/repositories/tickets/ticket-panel/create.js";

@Discord()
@SlashGroup({ name: "panel", description: "Comandos para manuseio de painéis." })
@SlashGroup("panel")
export class Command {
    @Slash({ name: "add", description: "Crei um novo painel de tickets." })
    @Guard(hasPermission("Administrator"), isGuildRegistered)
    async exec(
        @SlashOption({
            name: "name",
            description: "Nome que será dado ao painel.",
            type: ApplicationCommandOptionType.String,
            required: true
        }) name: string,
        interaction: CommandInteraction
    ) {
        const guildId = interaction.guildId as string;

        if (await ticketPanelExistsByName(guildId, name))
            return await interaction.reply({
                content: "*❌ Um painel com esse nome já existe.*",
                ephemeral: true
            });

        await ticketPanelCreate(guildId, name);
        await interaction.reply({
            content: `*✅ Painel \`${name}\` criado com sucesso!*`,
            ephemeral: true
        });
    }
}