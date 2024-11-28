import type { Relation } from "typeorm";
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Guild } from "./guild.js";

@Entity("guild_staff_role")
export class GuildStaffRoles extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true })
    roleId!: string;

    @Column({ default: true })
    canSendMessages!: boolean;
    
    @Column({ default: false })
    mentionOnTickets!: boolean;

    @ManyToOne(() => Guild, (guild) => guild.staffRoles, { onDelete: "CASCADE", onUpdate: "CASCADE" })
    @JoinColumn()
    guild!: Relation<Guild>;
}