import { TicketCategory } from "../../../entities/tickets/ticket-category.js"

export const ticketCategoryExistsById = async (panelId: number, categoryId: number) => {
    return await TicketCategory.exists({
        where: {
            panel: { id: panelId },
            id: categoryId
        }
    });
}