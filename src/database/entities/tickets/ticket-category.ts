import type { Relation } from "typeorm";
import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { TicketPanel } from "./ticket-panel.js";
import { Ticket } from "./ticket.js";

export type TTicketCategoriesKeys = "name" | "emoji" | "guildCategoryId" | "specificRoleId" | "count";

@Entity("ticket_category")
export class TicketCategory extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column({ nullable: true })
    emoji!: string;

    @Column({ nullable: true })
    guildCategoryId!: string;

    @Column({ nullable: true })
    specificRoleId!: string;

    @ManyToOne(() => TicketPanel, (panel) => panel.categories, { onDelete: "CASCADE", onUpdate: "CASCADE", eager: true })
    panel!: Relation<TicketPanel>;

    @OneToMany(() => Ticket, (ticket) => ticket.category)
    tickets!: Relation<TicketCategory>[];

    @Column({ default: 0 })
    count!: number;

    @CreateDateColumn()
    createdAt!: Date;
}