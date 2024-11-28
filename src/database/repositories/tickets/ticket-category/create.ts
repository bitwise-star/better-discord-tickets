import type { CategoryChannel } from "discord.js";
import type { TicketPanel } from "../../../entities/tickets/ticket-panel.js";
import { TicketCategory } from "../../../entities/tickets/ticket-category.js";

export const ticketCategoryCreate = async (panelId: number, name: string, emoji?: string, categoryChannel?: CategoryChannel) => {
    const category = new TicketCategory();

    category.name = name;
    category.emoji = emoji || "";
    category.panel = { id: panelId } as TicketPanel;
    category.guildCategoryId = categoryChannel?.id || "";

    return await category.save();
}