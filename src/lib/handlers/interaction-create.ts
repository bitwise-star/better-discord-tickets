import type { AnySelectMenuInteraction, ButtonInteraction, ModalSubmitInteraction } from "discord.js";
import handleError from "./error-handler.js";
import { Logger } from "../logger.js";

type TInteraction = "buttons" | "modals" | "menus";

export async function executeInteraction(interationType: TInteraction, interaction: ButtonInteraction | ModalSubmitInteraction | AnySelectMenuInteraction){
    const id = interaction?.customId;
	const fileName = `${id.replace(/[:]+/g, "-").replace(/[;](.*)+/g, "")}.js`;
	const category: string = id.split(":")[0];

	// biome-ignore lint/suspicious/noImplicitAnyLet:
	let handle;

	try {
		handle = (await import(`../../lib/interactions/${interationType}/${category}/${fileName}`)).handle;
	} catch (err) {
		return Logger.error(err);
	}

	await handle(interaction)
		.catch((err: Error) => { handleError(err, interaction) });
}