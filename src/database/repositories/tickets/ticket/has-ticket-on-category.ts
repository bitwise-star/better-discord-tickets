import { ETicketStatus, Ticket } from "../../../entities/tickets/ticket.js"

export const ticketUserHasCategoryTicket = async (guildId: string, ownerId: string, categoryId: number) => {
    return await Ticket.exists({
        where: {
            ownerId,
            category: {
                id: categoryId
            },
            panel: {
                guild: {
                    id: guildId
                }
            },
            status: ETicketStatus.OPEN
        }
    });
}