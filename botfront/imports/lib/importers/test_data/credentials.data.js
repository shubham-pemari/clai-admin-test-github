export const validCredentials = {
    filename: 'credentialstest.yml',
    rawText: 'rasa_addons.core.channels.webchat.WebchatInput:\n        session_persistence: true\n        base_url: \'http://localhost:8888\'\n         socketio_path: \'/development/socket.io/\'\n        socket_path: \'/development/socket.io/\'',
    dataType: 'credentials',
};

export const validCredentialsParsed = {
    'rasa_addons.core.channels.webchat.WebchatInput': {
        base_url: 'http://localhost:8888',
        session_persistence: true,
        socketio_path: '/development/socket.io/',
        socket_path: '/development/socket.io/',
    },
};
