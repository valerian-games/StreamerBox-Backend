import * as admin from 'firebase-admin'

const serviceAccount = require('../serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

export class Firebase {

    constructor() {}

    async getChannles(): Promise<string[]> {

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