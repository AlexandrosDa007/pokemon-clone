export const SOCKET_EVENTS = Object.freeze({
    STATE_CHANGE: 'stateChange',
    CONNECTION: 'connection',
    DISCONNECT: 'disconnect',
    KEY: 'key',
});

export const SOCKET_DISCONNECT_REASONS = Object.freeze({
    SERVER_DISCONNECT: 'io server disconnect',
    CLIENT_DISCONNECT: 'io client disconnect',
    PING_TIMEOUT: 'ping timeout',
    TRANSPORT_CLOSE: 'transport close',
    TRANSPORT_ERROR: 'transport error',
});
