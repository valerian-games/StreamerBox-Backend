import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

admin.initializeApp();

const db = admin.firestore()

export const liveLastCommand
    = functions
        .firestore
        .document('live/{channelName}/{channelCollections}/{commandId}')
        .onWrite((change, context) => {
            const data = change.before.data()
            const channelName = context.params.channelName
            const command = context.params.channelCollections == "commands"
            const last = context.params.commandId == "last"

            if (data == undefined || !command || !last)
                return null

            const timestamp = data.timestamp

            return db
                .doc(`live/${channelName}`)
                .set({lastCommand: timestamp}, {merge: true})
        })