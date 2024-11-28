import { Ticket } from "../../../entities/tickets/ticket.js"

export const ticketExistsByChannelId = async (channelId: string) => {
    return await Ticket.exists({
        where: { channelId }
    });
}