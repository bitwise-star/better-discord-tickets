import { type ArgsOf, type Client, Discord, Once } from "discordx";
import { Logger } from "../main.js";

@Discord()
export class Event {
    @Once({ event: "ready" })
    async exec([_]: ArgsOf<"ready">, client: Client) {
        const user = client.user;

        void client.initApplicationCommands();
        Logger.info(`Bot started as ${user?.username}(${user?.id})`);
    }
}