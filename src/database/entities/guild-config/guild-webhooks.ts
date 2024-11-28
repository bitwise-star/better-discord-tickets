import type { Relation } from "typeorm";
import { BaseEntity, Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Guild } from "./guild.js";

export type TValidWebhooksKeys = "logs";

@Entity("guild_webhooks")
export class GuildWebhooks extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ nullable: true })
    logs!: string;

    @OneToOne(() => Guild, (guild) => guild.webhooks, { onDelete: "CASCADE", onUpdate: "CASCADE" })
    @JoinColumn()
    guild!: Relation<Guild>;
}