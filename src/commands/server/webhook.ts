import type { TValidWebhooksKeys } from "../../database/entities/guild-config/guild-webhooks.js";
import type { CommandInteraction } from "discord.js";
import { ApplicationCommandOptionType } from "discord.js";
import { Discord, Guard, Slash, SlashChoice, SlashGroup, SlashOption } from "discordx";
import { hasPermission } from "../../lib/guard/has-permission.js";
import { isGuildRegistered } from "../../lib/guard/is-guild-registered.js";
import { guildWebhooksUpdate } from "../../database/repositories/guild-config/guild-webhooks/update.js";

@Discord()
@SlashGroup("server")
export class Command {
    @Slash({ name: "webhook", description: "Altere uma webhook nas configurações." })
    @Guard(hasPermission("ManageWebhooks"), isGuildRegistered)
    async exec(
        @SlashChoice(
            { name: "Logs internos", value: "logs" }
        )
        @SlashOption({
            name: "to_change",
            description: "Qual webhook será alterada na configuração.",
            type: ApplicationCommandOptionType.String,
            required: true
        }) toChange: TValidWebhooksKeys,
        @SlashOption({
            name: "webhook",
            description: "Qual o novo canal que será configurado.",
            type: ApplicationCommandOptionType.String,
            required: true
        }) webhook: string,
        interaction: CommandInteraction
    ) {
        const guildId = interaction.guildId as string;
        
        await guildWebhooksUpdate(guildId, toChange, webhook);
        await interaction.reply({
            content: "*✅ Webhook alterada com sucesso!*",
            ephemeral: true
        });
    }
}