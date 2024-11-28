import type { Relation } from "typeorm";
import { BaseEntity, Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Guild } from "./guild.js";

export type TValidCategoriesKeys = "openTickets" | "closedTickets";

@Entity("guild_categories")
export class GuildCategories extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ nullable: true })
    openTickets!: string;

    @Column({ nullable: true })
    closedTickets!: string;

    @OneToOne(() => Guild, (guild) => guild.categories, { onDelete: "CASCADE", onUpdate: "CASCADE" })
    @JoinColumn()
    guild!: Relation<Guild>;
}