import type { Relation } from "typeorm";
import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { TicketPanel } from "./ticket-panel.js";
import { TicketCategory } from "./ticket-category.js";

export enum ETicketStatus {
    CLOSED = "closed",
    OPEN = "open"
}

@Entity("ticket")
export class Ticket extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    ticketNumber!: number;
    
    @Column()
    baseName!: string;

    @ManyToOne(() => TicketPanel, (panel) => panel.tickets, { nullable: true, eager: true })
    panel!: Relation<TicketPanel>;

    @ManyToOne(() => TicketCategory, (category) => category.tickets, { nullable: true, eager: true})
    category!: Relation<TicketCategory>;

    @Column()
    ownerId!: string;

    @Column()
    channelId!: string;

    @Column({ enum: ETicketStatus, default: ETicketStatus.OPEN, type: "varchar" })
    status!: ETicketStatus;

    @CreateDateColumn()
    createdAt!: Date;
}