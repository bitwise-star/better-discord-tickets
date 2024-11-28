import { dataSource } from "../../../connection.js"
import { TicketCategory } from "../../../entities/tickets/ticket-category.js"

export const ticketCategoryRemove = async (id: number) => {
    await dataSource.createQueryBuilder()
        .delete()
        .from(TicketCategory)
        .where("id=:id", { id })
        .execute();
}