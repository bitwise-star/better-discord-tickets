import { dataSource } from "../../../connection.js";
import { TicketCategory, type TTicketCategoriesKeys } from "../../../entities/tickets/ticket-category.js";

export const ticketCategoryUpdate = async<T>(id: number, toUpdate: TTicketCategoriesKeys, update: T) => {
    return await dataSource.createQueryBuilder()
        .update(TicketCategory)
        .set({ [toUpdate]: update })
        .where("id=:id", { id })
        .execute();
}