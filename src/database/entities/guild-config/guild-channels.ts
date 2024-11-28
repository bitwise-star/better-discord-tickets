import type { Relation } from "typeorm";
import { BaseEntity, Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Guild } from "./guild.js";

export type TValidChannelsKeys = "transcript" | "logs";

@Entity("guild_channels")
export class GuildChannels extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: string;

    @Column({ nullable: true })
    transcript!: string;

    @Column({ nullable: true })
    logs!: string;

    @OneToOne(() => Guild, (guild) => guild.channels, { onDelete: "CASCADE", onUpdate: "CASCADE" })
    @JoinColumn()
    guild!: Relation<Guild>;
}