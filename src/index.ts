import * as tmi from 'tmi.js'
import * as database from './firebase'

async function main() {
    const channels = await database.getChannles()
    const commands = await database.getCommands()
 
    const opts = {
        options: {
            debug: true
        },
        identity: {
          username: "valerian_games_bot",
          password: "oauth:6ixxyhi380gwb7pwslkpo6t9c68ifb"
        },
        channels: channels
    };
    
    const client = tmi.client(opts)
    
    client.on('message', (target, context, msg, self) => {
        if (self) return
    
        const channelName = target.replace('#', '') 

        for (let c of commands) {
            if (msg.trim() == c.trim()) {
                // TODO: DON'T ACCEPT ALL MESSAGES
                client.say(target, `${c} it is!`);
                database.live(channelName, c, context.username)
            }
        }
    
    });
    
    // client.on('connected', (addr, port) => {
        
    // });
    
    client.connect()
}

main()