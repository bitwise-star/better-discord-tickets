import type { Embed } from "discord.js";
import { EmbedBuilder } from "discord.js";

export async function copyEmbed(embed: Embed) {
    const copy = new EmbedBuilder()
        .setTitle(embed.title || null)
        .setDescription(embed.description || null)
        .setColor(embed.color || null)
        .setImage(embed.image?.url || null)
        .setFooter(embed.footer || null)
        .setThumbnail(embed.thumbnail?.url || null)
        .setAuthor(embed.author || null);

    return copy;
}