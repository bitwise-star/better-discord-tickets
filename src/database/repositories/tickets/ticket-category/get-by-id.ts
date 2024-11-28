import { TicketCategory } from "../../../entities/tickets/ticket-category.js"

export const ticketCategoryGetById = async (id: number) => {
    return await TicketCategory.findOne({
        where: { id }
    });
}