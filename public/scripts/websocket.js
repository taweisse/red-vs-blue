'use strict'

const socket = io();

function WebsocketUpdater() {
    return {
        subscribe: (msg, callback) => {
            socket.on(msg, (data) => {
                callback(data)
            })
        }
    }
}
