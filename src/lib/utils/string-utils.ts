import type { AnySelectMenuInteraction, ModalSubmitInteraction } from "discord.js";

export const formatNumberToFourDigits = (integer: number) => {
    return integer.toString().padStart(4, '0');
}

export const formatPlaceholders = (message: string, interaction: AnySelectMenuInteraction | ModalSubmitInteraction) => {
    return message
        .trim()
        .replace(/\{\@user\}/g, `<@${interaction.user.id}>`)
}

export const toTwoDigits = (integer: number): string => integer.toString().padStart(2, '0');

export const formatDate = (date: Date): string => {
    const day = toTwoDigits(date.getDate());
    const month = toTwoDigits(date.getMonth() + 1);
    const year = date.getFullYear();
    const hours = toTwoDigits(date.getHours());
    const minutes = toTwoDigits(date.getMinutes());
    const seconds = toTwoDigits(date.getSeconds());

    return `${day}/${month}/${year} às ${hours}:${minutes}:${seconds}`;
};
