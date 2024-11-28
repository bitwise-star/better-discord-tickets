import type { Relation } from "typeorm";
import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { TicketCategory } from "./ticket-category.js";
import { Guild } from "../guild-config/guild.js";
import { Ticket } from "./ticket.js";

@Entity("ticket_panel")
export class TicketPanel extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column()
    message!: string;

    @Column({ default: 0 })
    count!: number;

    @ManyToOne(() => Guild, (guild) => guild.panels, { onDelete: "CASCADE", onUpdate: "CASCADE", eager: true })
    guild!: Relation<Guild>;

    @OneToMany(() => TicketCategory, (categories) => categories.panel)
    categories!: Relation<TicketCategory>;

    @OneToMany(() => Ticket, (tickets) => tickets.panel)
    tickets!: Relation<Ticket>[];

    @CreateDateColumn()
    createdAt!: Date;
}