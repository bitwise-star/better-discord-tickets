import type { ArgsOf } from "discordx";
import { Discord, On } from "discordx";
import { ticketGetByChannelId } from "../database/repositories/tickets/ticket/get-by-channel-id.js";
import { Logger } from "../lib/logger.js";
import { ticketExistsByChannelId } from "../database/repositories/tickets/ticket/exists-by-channel-id.js";

@Discord()
export class Event {
    @On({ event: "channelDelete" })
    async exec([channel]: ArgsOf<"channelDelete">) {
        if (!await ticketExistsByChannelId(channel.id)) return;

        const ticket = await ticketGetByChannelId(channel.id);
        await ticket?.remove()
            .catch((err) => Logger.error(err));
    }
}