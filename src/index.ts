import { REST, Routes, Client, GatewayIntentBits, EmbedBuilder, ActivityType } from "discord.js";
import { config } from "dotenv";
import { readdirSync } from "fs";
import { join } from "path";
import { Command } from "./templates/Command";
import { AsyncArray } from "./utils/AsyncArray";
import { DevConsole } from "./utils/DevConsole";

config();
DevConsole.info("Caching commands");

export const CLIENT = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildEmojisAndStickers,
        GatewayIntentBits.GuildWebhooks,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions
    ]
});

const commandsDir = join(__dirname, "commands");
const commandMap = new Map<string, Command>();

AsyncArray.from(readdirSync(commandsDir)).asyncForEach(async (command) => {
    const commandObject: Command = new (await import(join(commandsDir, command)))[command.split(".")[0]]();

    commandMap.set(commandObject.commandBuild.name, commandObject);
}).then(() => {
    DevConsole.info("Registering slash commands");

    new REST({
        version: "9"
    }).setToken(process.env.TOKEN!).put(Routes.applicationCommands(process.env.APPLICATION_ID!), {
        body: [...commandMap.values()].map(({ commandBuild }) => commandBuild.toJSON())
    }).then(() => {
        DevConsole.info("Successfully loaded all slash commands");

        CLIENT.login(process.env.TOKEN);
    }).catch(DevConsole.error);
});

CLIENT.on("ready", () => {
    if (CLIENT.user) {
        DevConsole.info("Registered as \x1b[34m%s\x1b[0m", CLIENT.user.tag);
        
        CLIENT.user.setPresence({
            activities: [
                {
                    name: "hentai",
                    type: ActivityType.Watching
                }
            ]
        });
    } else {
        DevConsole.error("Registered as... How the actual hell do you not have a user tag?????");
    }
});

CLIENT.on("interactionCreate", (interaction) => {
    if (interaction.isCommand()) {
        const command = commandMap.get(interaction.commandName);

        if (command) {
            command.trigger(interaction).catch(DevConsole.error);
        } else {
            interaction.reply("Yeee, you eeeh, should probably report to Discord that somehow unregistered slash commands are still being triggered.");
        }
    }
});

CLIENT.on("messageCreate", (message) => {
    // Added for debugging purposes
    if (message.content.startsWith("!eval") && message.author.id == "373128858687373323") {
        try {
            const client = CLIENT;

            // Reserved for eval
            client;

            eval(/`{3}(?:js)?(?:\n)?((?:\n|.)*?)(?:\n)?`{3}/.exec(message.content)?.[1] || message.content.slice(6));
        } catch (error) {
            message.reply({
                embeds: [ new EmbedBuilder().setTitle("Error!").setDescription("```" + error + "```").setTimestamp(new Date()).setColor("Red") ]
            });
        }
    }
});