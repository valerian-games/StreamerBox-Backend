import * as functions from 'firebase-functions'
// import * as admin from 'firebase-admin'

export const liveLastCommand
    = functions
        .firestore
        .document('live/{channelName}/command/last')
        .onWrite((change, context) => {
            const data = change.before.data()

            if (data == undefined)
                return null

            return change.before.ref.parent.add(data)
        })