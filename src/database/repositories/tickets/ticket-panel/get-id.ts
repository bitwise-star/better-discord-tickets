import { TicketPanel } from "../../../entities/tickets/ticket-panel.js"

export const ticketPanelGetId = async (guildId: string, name: string) => {
    const data = await TicketPanel.findOne({
        where: {
            guild: { id: guildId },
            name
        },
        select: { id: true }
    });

    return data?.id;
}