import type { TValidRoleKeys } from "../../database/entities/guild-config/guild-roles.js";
import type { CommandInteraction, Role } from "discord.js";
import { Discord, Guard, Slash, SlashChoice, SlashGroup, SlashOption } from "discordx";
import { hasPermission } from "../../lib/guard/has-permission.js";
import { ApplicationCommandOptionType } from "discord.js";
import { isGuildRegistered } from "../../lib/guard/is-guild-registered.js";
import { updateGuildRole } from "../../database/repositories/guild-config/guild-roles/update.js";

@Discord()
@SlashGroup("server")
export class Command {
    @Slash({ name: "role", description: "Defina as roles nas configurações." })
    @Guard(hasPermission("ManageRoles"), isGuildRegistered)
    async exec(
        @SlashChoice({ name: "Desenvolvedor", value: "developer" })
        @SlashOption({
            name: "role_type",
            description: "Qual será o cargo que será alterado na configuração.",
            type: ApplicationCommandOptionType.String,
            required: true
        }) roleType: TValidRoleKeys,
        @SlashOption({
            name: "role",
            description: "Novo cargo que será definido na configuração.",
            type: ApplicationCommandOptionType.Role,
            required: true
        }) newRole: Role,
        interaction: CommandInteraction
    ) {
        const guildId = interaction.guildId as string;
        await updateGuildRole(guildId, roleType, newRole.id);

        await interaction.reply({
            content: "*✅ Alteração aplicada com sucesso!*",
            ephemeral: true
        });
    }
}