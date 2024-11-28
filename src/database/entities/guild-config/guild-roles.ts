import type { Relation } from "typeorm";
import { BaseEntity, Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Guild } from "./guild.js";

export type TValidRoleKeys = "developer";

@Entity("guld_roles")
export class GuildRoles extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ nullable: true })
    developer!: string;

    @OneToOne(() => Guild, (guild) => guild.roles, { onDelete: "CASCADE", onUpdate: "CASCADE" })
    @JoinColumn()
    guild!: Relation<Guild>;
}