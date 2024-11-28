import { Ticket } from "../../../entities/tickets/ticket.js"

export const ticketGetByChannelId = async (channelId: string) => {
    return await Ticket.findOne({
        where: { channelId }
    });
}