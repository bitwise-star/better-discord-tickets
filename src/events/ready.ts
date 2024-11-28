import { type ArgsOf, type Client, Discord, Once } from "discordx";
import { Logger } from "../lib/logger.js";

@Discord()
export class ReadyEvent {
    @Once({ event: "ready" })
    async exec([_]: ArgsOf<"ready">, client: Client) {
        const user = client.user;

        void client.initApplicationCommands();
        Logger.info(`Bot conectado como ${user?.username}(${user?.id})`);
    }
}