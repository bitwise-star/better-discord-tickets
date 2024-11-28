import { DataSource } from "typeorm";
import { Guild } from "./entities/guild-config/guild.js";
import { GuildStaffRoles } from "./entities/guild-config/guild-staff-roles.js";
import { GuildRoles } from "./entities/guild-config/guild-roles.js";
import { GuildChannels } from "./entities/guild-config/guild-channels.js";
import { GuildCategories } from "./entities/guild-config/guild-categories.js";
import { Ticket } from "./entities/tickets/ticket.js";
import { GuildWebhooks } from "./entities/guild-config/guild-webhooks.js";
import { TicketPanel } from "./entities/tickets/ticket-panel.js";
import { TicketCategory } from "./entities/tickets/ticket-category.js";

export const dataSource = new DataSource({
    type: "sqlite",
    synchronize: true,
    database: "database.db",
    entities: [
        Guild, GuildStaffRoles, GuildRoles,
        GuildChannels, GuildCategories, GuildWebhooks,
        Ticket, TicketPanel, TicketCategory,
    ]
});