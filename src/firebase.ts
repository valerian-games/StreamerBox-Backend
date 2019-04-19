import * as admin from 'firebase-admin'

const serviceAccount = require('../serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

export class Firebase {

    constructor() {}

    async getChannes(): Promise<string[]> {

        const channels = await db.collection("channels").get()
    
        let arr: string[] = []
    
        for(let doc of channels.docs) 
            arr.push(doc.data().channel)
    
        return Promise.resolve(arr)
    }
    
    async getCommands() : Promise<string[]> {
        const commands = await db.collection("commands").get()
    
        let arr: string[] = []
    
        for (let doc of commands.docs) 
            arr.push(doc.data().command)
    
        return Promise.resolve(arr)
    }

    getChannel(channelName: string) {
        return db.doc(`live/${channelName}`).get()
    }
    
    async getGameCommands(gameName: string): Promise<string[]> {
        const game = await db.doc(`games/${gameName}`).get()
        const data = game.data()

        let commands: string[] = []

        if (data == undefined) 
            return Promise.resolve(commands)
            
        commands = data.commands

        return Promise.resolve(commands)
    }
    
    async live(channelName: string, command: string, from: string | undefined) {
        const ref = db.collection("live").doc(channelName).collection("commands").doc("last")
    
        const data = {
            command: command,
            from: from,
            timestamp: new Date()
        }
    
        return ref.set(data)
    }
}