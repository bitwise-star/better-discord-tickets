import type { CommandInteraction, PermissionFlags } from "discord.js";
import { PermissionFlagsBits } from "discord.js";
import type { GuardFunction } from "discordx";

export function hasPermission(permission: keyof PermissionFlags) {
	const guard: GuardFunction<CommandInteraction> =
	async (interaction, client, next) => {
		const permissionBigInt = PermissionFlagsBits[permission];

		if (interaction.memberPermissions?.has(permissionBigInt))
			return await next();

		await interaction.reply({
			content: `*❌ Você não possui permissão para utilizar esse comando. Permissão necessária: \`${permission}\`*`,
			ephemeral: true
		});
	};

	return guard;
}
