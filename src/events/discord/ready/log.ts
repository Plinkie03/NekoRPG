import { DiscordEvent } from '../../../structures/discord/DiscordEvent.js';

export default new DiscordEvent({
    listener: 'ready',
    async execute(client) {
        console.log(`Ready on client ${client.user.username}!`);
    },
});