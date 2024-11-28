import type { CommandInteraction } from "discord.js";
import { Discord, Guard, Slash, SlashGroup } from "discordx";
import { hasPermission } from "../../lib/guard/has-permission.js";
import { isGuildRegistered } from "../../lib/guard/is-guild-registered.js";
import { closeTicket } from "../../lib/functions/close-ticket.js";

@Discord()
@SlashGroup({ name: "support", description: "Comandos relacionados aos tickets de suporte." })
@SlashGroup("support")
export class Command {
    @Slash({ name: "close", description: "Feche um ticket que se encontra atualmente aberto via comando." })
    @Guard(hasPermission("ManageChannels"), isGuildRegistered)
    async exec(interaction: CommandInteraction) {
        await closeTicket(interaction);
    }
}