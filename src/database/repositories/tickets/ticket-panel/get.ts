import { TicketPanel } from "../../../entities/tickets/ticket-panel.js"

export const ticketPanelGetAll = async (guildId: string) => {
    return await TicketPanel.find({
        where: {
            guild: { id: guildId }
        },
        select: {
            id: true,
            name: true,
            createdAt: true
        }
    })
}