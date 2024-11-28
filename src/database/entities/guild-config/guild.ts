import type { Relation } from "typeorm";
import { GuildStaffRoles } from "./guild-staff-roles.js";
import { BaseEntity, Column, Entity, OneToMany, OneToOne, PrimaryColumn } from "typeorm";
import { GuildChannels } from "./guild-channels.js";
import { GuildRoles } from "./guild-roles.js";
import { GuildCategories } from "./guild-categories.js";
import { GuildWebhooks } from "./guild-webhooks.js";
import { TicketPanel } from "../tickets/ticket-panel.js";
@Entity("guild")
export class Guild extends BaseEntity {
    @PrimaryColumn()
    id!: string;

    @Column({ default: 0 })
    baseTicketCount!: number;

    @OneToMany(() => GuildStaffRoles, (roles) => roles.guild)
    staffRoles!: Relation<GuildStaffRoles>[];

    @OneToOne(() => GuildChannels, (channels) => channels.guild)
    channels!: Relation<GuildChannels>;

    @OneToOne(() => GuildRoles, (roles) => roles.guild)
    roles!: Relation<GuildRoles>;

    @OneToOne(() => GuildCategories, (categories) => categories.guild)
    categories!: Relation<GuildCategories>;

    @OneToOne(() => GuildWebhooks, (webhooks) => webhooks.guild)
    webhooks!: Relation<GuildWebhooks>;

    @OneToMany(() => TicketPanel, (panels) => panels.guild)
    panels!: Relation<TicketPanel>;
}