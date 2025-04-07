import { DatabaseEvent } from '../../../structures/discord/DatabaseEvent.js';

export default new DatabaseEvent({
    listener: 'expire',
    async execute(key, value) {
        console.log('handle your ' + key + ' and ' + value);
    },
});