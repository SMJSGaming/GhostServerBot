import { SlashCommandBuilder, SlashCommandSubcommandsOnlyBuilder, BaseInteraction, Snowflake } from "discord.js";
import { DevConsole } from "../utils/DevConsole";

export abstract class Command {

    public readonly commandBuild: SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder;

    public readonly guilds: Snowflake[];

    constructor(commandBuild: any, guilds?: Snowflake[]) {
        DevConsole.info("Registered the \x1b[36m/%s\x1b[0m command", commandBuild.name);

        this.commandBuild = commandBuild;
        this.guilds = guilds ?? [];
    }

    public abstract trigger(interaction: BaseInteraction): Promise<void>;
}