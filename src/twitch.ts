import * as tmi from 'tmi.js'
import { Firebase } from './firebase'

const env = require('../env.json')

const database = new Firebase()

export class Twitch {

    constructor() { this.init() }

    private async init() {
        const channels = await database.getChannles()
        const commands = await database.getCommands()

        const opts = {
            options: {
                debug: true
            },
            identity: env,
            channels: channels
        };
        
        const client = tmi.client(opts)
        
        client.on('message', (target, context, msg, self) => {
            if (self) return
        
            const channelName = target.replace('#', '') 
            const username = context.username
    
            commands.forEach(async c => {
                if (msg.trim() == c.trim()) {
                    
                    // if (canCommand) {
                    //     client.say(target, `${c} it is!`);
                    //     database.live(channelName, c, username)
                    // }
                } 
            });
        });
    
        client.connect()
    }
}