import type { Guild } from "../../../entities/guild-config/guild.js";
import { TicketPanel } from "../../../entities/tickets/ticket-panel.js"

export const ticketPanelCreate = async (guildId: string, name: string) => {
    const panel = new TicketPanel()

    panel.name = name;
    panel.message = "Olá {@user}, seja bem-vindo(a) ao seu ticket."
    panel.guild = { id: guildId } as Guild;

    return await panel.save();
}