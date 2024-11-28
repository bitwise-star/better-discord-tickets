import { TicketCategory } from "../../../entities/tickets/ticket-category.js"

export const ticketCategoryGetAll = async (panelId: number) => {
    return await TicketCategory.find({
        where: {
            panel: { id: panelId }
        }
    });
}