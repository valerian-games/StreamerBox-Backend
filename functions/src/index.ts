import * as functions from 'firebase-functions'
// import * as admin from 'firebase-admin'

export const liveLastCommand
    = functions
        .firestore
        .document('live/{channelName}/{channelCollections}/{commandId}')
        .onWrite((change, context) => {
            const data = change.before.data()
            const command = context.params.channelCollections == "commands"
            const last = context.params.commandId == "last"

            if (data == undefined || !command || !last)
                return null

            return change.before.ref.parent.add(data)
        })