import { ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from "discord.js"
import { ticketCategoryGetAll } from "../../../database/repositories/tickets/ticket-category/get-all.js";

export const getCategoryMenu = async (panelId: number, placeholder?: string) => {
    const categories = await ticketCategoryGetAll(panelId);

    if (categories.length === 0)
        return undefined;

    const select = new StringSelectMenuBuilder()
        .setCustomId("ticket:menus:category")
        .setPlaceholder(placeholder || "Escolha a categoria de suporte");
    
    const selections = [];

    for (const category of categories) {
        const selection = new StringSelectMenuOptionBuilder()
            .setLabel(category.name)
            .setValue(category.id.toString());

        if (category.emoji)
            selection.setEmoji(category.emoji);
        selections.push(selection);
    }

    select.addOptions(selections)

    const row = new ActionRowBuilder<StringSelectMenuBuilder>()
        .addComponents(select);

    return row;
}