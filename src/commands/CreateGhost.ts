import { SlashCommandBuilder, CommandInteraction } from "discord.js";
import { Command } from "../templates/Command";

export class CreateGhost extends Command {
    
        constructor() {
            super(new SlashCommandBuilder().setName("create-ghost")
                .addNumberOption((option) => option.setName("depth")
                    .setDescription("How many messages per channel should be cloned. Leaving it blank or on -1 will clone all messages.")
                    .setMinValue(-1)
                    .setRequired(false))
                .addStringOption((option) => option.setName("included-channels")
                    .setDescription("The channel names (case sensitive) to clone separated by commas. Leaving it blank will include all channels.")
                    .setRequired(false))
                .addStringOption((option) => option.setName("excluded-channels")
                    .setDescription("The channel names (case sensitive) to exclude from the clone separated by commas. Leaving it blank will exclude no channels.")
                    .setRequired(false))
                .setDescription("Creates a ghost copy of the server and invites you to it. Caution: This command can take a while to complete.")
            );
        }
    
        public async trigger(interaction: CommandInteraction): Promise<void> {
            interaction.reply("This command is not yet implemented.");
        }
}