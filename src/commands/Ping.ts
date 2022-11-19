import { SlashCommandBuilder, CommandInteraction, EmbedBuilder } from "discord.js";
import { Command } from "../templates/Command";

export class Ping extends Command {
    
        constructor() {
            super(new SlashCommandBuilder().setName("ping").setDescription("Pings the bot and returns the latency"));
        }
    
        public async trigger(interaction: CommandInteraction): Promise<void> {
            const time = Date.now();

            interaction.deferReply().then(() => interaction.editReply({
                embeds: [
                    new EmbedBuilder().setTitle("Ping Result").setFields({
                        name: "Receive latency",
                        value: `${time - interaction.createdTimestamp}ms`,
                        inline: true
                    }, {
                        name: "Send latency",
                        value: `${Date.now() - time}ms`,
                        inline: true
                    }).setTimestamp(time)
                ]
            }));
        }
}