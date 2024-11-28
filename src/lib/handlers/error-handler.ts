import type { Interaction, Message } from "discord.js";
import { WebhookClient } from "discord.js";
import { Logger } from "../../lib/logger.js";
import { guildWebhooksGet } from "../../database/repositories/guild-config/guild-webhooks/get.js";
import { guildRolesGet } from "../../database/repositories/guild-config/guild-roles/get.js";

async function handleError(
	error: Error,
	interaction: Message | Interaction,
) {
	const guildId = interaction.guildId as string;
	Logger.error(error);

	// Channel
	const webhookURL = await guildWebhooksGet(guildId, "logs");
	const devRoleId = await guildRolesGet(guildId, "developer");

	if (!webhookURL) return;

	try {
		const webhook = new WebhookClient({ url: webhookURL });

		// Creating logs message
		const logsFile = Buffer.from(error?.stack || "", "utf-8");
		let content = `> **Erro encontrado:** ${error.name}\n> - **Causa:** \`${error.message}\``;

		if (devRoleId)
			content += `\n\n <@&${devRoleId}>`;

		await webhook.send({
			content: content,
			files: (logsFile.length !== 0) ? [{
				name: "error.log",
				attachment: logsFile
			}] : []
		});
	} catch {
		Logger.warn(`Invalid guild(${guildId}) channel webhook set, cannot send message to dev logs.`);
	}
}

export default handleError;
