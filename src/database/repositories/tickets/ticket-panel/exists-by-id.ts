import { TicketPanel } from "../../../entities/tickets/ticket-panel.js"

export const ticketPanelExistsById = async (guildId: string, panelId: number) => {
    return await TicketPanel.exists({
        where: {
            guild: { id: guildId },
            id: panelId
        }
    });
}