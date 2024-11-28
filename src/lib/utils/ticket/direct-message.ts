import type { MessageCreateOptions, MessagePayload, GuildMember, CommandInteraction, ButtonInteraction, ModalSubmitInteraction, AnySelectMenuInteraction } from "discord.js";

export const sendMessageIntoDM = async (
    interaction: CommandInteraction | ButtonInteraction | ModalSubmitInteraction | AnySelectMenuInteraction,
    member: string | GuildMember,
    options: string | MessagePayload | MessageCreateOptions
) => {
    const dmMember = (typeof member === "string") ? await interaction.guild?.members.fetch(member) : member;
    if (!dmMember) return;

    const dm = await dmMember.createDM(true);
    if (!dm) return;

    await dm.send(options);
}