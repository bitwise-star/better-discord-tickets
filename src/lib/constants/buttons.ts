import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";

// -- Opening ticket button
const closeBtn = new ButtonBuilder()
    .setCustomId("ticket:close:button")
    .setLabel("Fechar Ticket")
    .setStyle(ButtonStyle.Danger)
    .setEmoji("🔒");

const warnBtn = new ButtonBuilder()
    .setCustomId("ticket:warn:button")
    .setLabel("Avisar membro")
    .setStyle(ButtonStyle.Primary)
    .setEmoji("🔔");

const claimBtn = new ButtonBuilder()
    .setCustomId("ticket:claim:button")
    .setLabel("Reinvidicar ticket")
    .setStyle(ButtonStyle.Success)
    .setEmoji("📌");

const addMemberBtn = new ButtonBuilder()
    .setCustomId("ticket:add:member:button")
    .setLabel("Adicionar outro membro")
    .setStyle(ButtonStyle.Success)
    .setEmoji("➕");

export const openingTicketRow1 = new ActionRowBuilder<ButtonBuilder>()
    .addComponents(closeBtn, warnBtn, );
export const openingTicketRow2 = new ActionRowBuilder<ButtonBuilder>()
    .addComponents(claimBtn, addMemberBtn)

// Closing ticket Buttons (admin panel)
const reopenBtn = new ButtonBuilder()
    .setCustomId("ticket:reopen:button")
    .setEmoji("🔓")
    .setLabel("Reabrir")
    .setStyle(ButtonStyle.Success);

const deleteBtn = new ButtonBuilder()
    .setCustomId("ticket:delete:button")
    .setEmoji("🛑")
    .setLabel("Deletar Ticket")
    .setStyle(ButtonStyle.Danger);

const transcriptBtn = new ButtonBuilder()
    .setCustomId("ticket:transcript:button")
    .setEmoji("📑")
    .setLabel("Gerar cópia")
    .setStyle(ButtonStyle.Primary);

export const closingTicketRow = new ActionRowBuilder<ButtonBuilder>()
    .addComponents(reopenBtn, deleteBtn, transcriptBtn);
