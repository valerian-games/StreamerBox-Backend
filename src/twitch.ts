import * as tmi from 'tmi.js'
import { firestore } from 'firebase-admin'
import { Firebase } from './firebase'

const env = require('../env.json')

const database = new Firebase()

export class Twitch {

    constructor() { this.init() }

    private async init() {
        const channels = await database.getChannes()

        const opts = {
            options: {
                debug: true
            },
            identity: env,
            channels: channels
        };

        const client = tmi.client(opts)

        client.on('message', async (target, context, msg, self) => {
            if (self) return
            if (msg.charAt(0) != '?') return

            const channelName = target.replace('#', '')
            const username = context.username

            const channel = await database.getChannel(channelName)
            const channelData = channel.data()

            if (!channel.exists || channelData == undefined)
                return client.say(target, `@${username}, ${target} is not playing Valerian Games`)
                
            const commands = await database.getGameCommands(channelData.playing)

            const cooldown: number = channelData.loopInMills // 600000
            const timestamp: firestore.Timestamp = channelData.lastCommand
            const currentTime = new Date()

            const diffence = currentTime.getTime() - timestamp.toMillis()

            console.log(diffence, cooldown, cooldown > diffence)

            if (cooldown > diffence) 
                return

            commands.forEach(async c => {
                if (msg.trim() == c.trim()) {
                    client.say(target, `${c} it is!`);
                    database.live(channelName, c, username)
                }
            });
        });

        client.connect()
    }
}