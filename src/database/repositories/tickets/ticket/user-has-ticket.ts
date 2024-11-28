import { ETicketStatus, Ticket } from "../../../entities/tickets/ticket.js"

export const ticketUserHasTicket = async (guildId: string, ownerId: string) => {
    return await Ticket.exists({
        where: {
            ownerId,
            panel: {
                guild: {
                    id: guildId
                }
            },
            status: ETicketStatus.OPEN
        }
    });
}