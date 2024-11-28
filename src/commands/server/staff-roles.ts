import type { Role, CommandInteraction } from "discord.js";
import { ApplicationCommandOptionType } from "discord.js";
import { Discord, Guard, Slash, SlashChoice, SlashGroup, SlashOption } from "discordx";
import { hasPermission } from "../../lib/guard/has-permission.js";
import { isGuildRegistered } from "../../lib/guard/is-guild-registered.js";
import { guildStaffRoleRemove } from "../../database/repositories/guild-config/guild-staff-roles/remove.js";
import { createRole } from "../../database/repositories/guild-config/guild-staff-roles/create.js";
import { guildStaffRoleExists } from "../../database/repositories/guild-config/guild-staff-roles/exists.js";

type TStaffRoleChange = "rm" | "add"; 

@Discord()
@SlashGroup("server")
export class Command {
    @Slash({ name: "staff-role", description: "Adicione ou remova um cargo como staff nos tickets!" })
    @Guard(hasPermission("ManageRoles"), isGuildRegistered)
    async exec (
        @SlashChoice(
            { name: "Remover", value: "rm" },
            { name: "Adicionar", value: "add" }
        )
        @SlashOption({
            name: "change",
            description: "Qual é a operação que será realizada.",
            type: ApplicationCommandOptionType.String,
            required: true
        }) change: TStaffRoleChange,
        @SlashOption({
            name: "role",
            description: "Role que será colocada/retirada da configuração.",
            type: ApplicationCommandOptionType.Role,
            required: true
        }) role: Role,
        @SlashOption({
            name: "can_send_messages",
            description: "Pode mandar mensagem em tickets de suporte?",
            type: ApplicationCommandOptionType.Boolean,
            required: false
        }) canSendMessages: boolean,
        @SlashOption({
            name: "mention_on_tickets",
            description: "Deve ser mencionado em tickets de suporte?",
            type: ApplicationCommandOptionType.Boolean,
            required: false
        }) mentionOnTickets: boolean,
        interaction: CommandInteraction
    ) {
        const roleId = role.id;
        const guildId = interaction.guildId as string;

        switch (change) {
            case "rm":
                await guildStaffRoleRemove(roleId);
                await interaction.reply({
                    content: "*✅ Cargo `removido` como staff com sucesso!*",
                    ephemeral: true
                });
                break
                ;
            case "add":
                if (await guildStaffRoleExists(role.id))
                    return await interaction.reply({
                        content: "*❌ Esse cargo já se encontra registrado.*",
                        ephemeral: true
                    });

                await createRole(roleId, guildId, canSendMessages, mentionOnTickets);
                await interaction.reply({
                    content: "*✅ Cargo `adicionado` como staff com sucesso!*",
                    ephemeral: true
                });
                break;
        }
    }
}