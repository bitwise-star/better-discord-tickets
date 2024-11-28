import { TicketPanel } from "../../../entities/tickets/ticket-panel.js"

export const ticketPanelExistsByName = async (guildId: string, name: string) => {
    return await TicketPanel.exists({
        where: {
            guild: { id: guildId },
            name
        }
    });
}