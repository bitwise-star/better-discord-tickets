import type { CommandInteraction } from "discord.js";
import type { Client } from "discordx";
import { ApplicationCommandOptionType } from "discord.js";
import { Discord, Guard, Slash, SlashGroup, SlashOption } from "discordx";
import { hasPermission } from "../../../lib/guard/has-permission.js";
import { isGuildRegistered } from "../../../lib/guard/is-guild-registered.js";
import { getCategoryMenu } from "../../../lib/utils/ticket/category-list-menu.js";

@Discord()
@SlashGroup("panel")
export class Command {
    @Slash({ name: "set-menu", description: "Adiciona uma caixa de menu em uma mensagem." })
    @Guard(hasPermission("Administrator"), isGuildRegistered)
    async exec(
        @SlashOption({
            name: "panel_id",
            description: "ID do painel que será criado a lista.",
            type: ApplicationCommandOptionType.Number,
            required: true,
            minValue: 0
        }) panelId: number,
        @SlashOption({
            name: "message_id",
            description: "ID da mensagem que receberá o menu.",
            type: ApplicationCommandOptionType.String,
            required: true
        }) messageId: string,
        interaction: CommandInteraction,
        client: Client
    ) {
        const message = await interaction.channel?.messages.fetch(messageId);

        if (!message || message.author.id !== client.user?.id)
            return await interaction.reply({
                content: "*❌ Eu não consigo editar uma mensagem na qual não pertence a mim ou ela não existe.*",
                ephemeral: true
            });
        
        const menu = await getCategoryMenu(panelId);

        if (!menu)
            return await interaction.reply({
                content: "*❌ Esse painel não possui nenhuma categoria.*",
                ephemeral: true
            });

        await message.edit({
            components: [menu]
        });

        await interaction.reply({
            content: "*✅ Menu setado na mensagem com sucesso!*",
            ephemeral: true
        });
    }
}