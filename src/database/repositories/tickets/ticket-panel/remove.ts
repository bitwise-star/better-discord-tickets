import { dataSource } from "../../../connection.js"
import { TicketPanel } from "../../../entities/tickets/ticket-panel.js"

export const ticketPanelRemove = async (id: number) => {
    await dataSource.createQueryBuilder()
        .delete()
        .from(TicketPanel)
        .where("id=:id", { id })
        .execute();
}