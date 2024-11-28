import type { ButtonInteraction } from "discord.js";
import { closeTicket } from "../../../functions/close-ticket.js";

export const handle = async (interaction: ButtonInteraction) => {
    await closeTicket(interaction);
}