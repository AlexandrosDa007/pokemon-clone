export const SOCKET_EVENTS = Object.freeze({
    STATE_CHANGE: 'stateChange',
    CONNECTION: 'connection',
    DISCONNECT: 'disconnect',
    KEY: 'key',
    BATTLE_INVITES: 'battleInvites',
    INVITE_TO_BATTLE: 'inviteToBattle',
    ENCOUNTER: 'encounter',
    ENCOUNTER_ACKNOWLEDGED: 'encounterAcknowledged',
});

export const SOCKET_DISCONNECT_REASONS = Object.freeze({
    SERVER_DISCONNECT: 'io server disconnect',
    CLIENT_DISCONNECT: 'io client disconnect',
    PING_TIMEOUT: 'ping timeout',
    TRANSPORT_CLOSE: 'transport close',
    TRANSPORT_ERROR: 'transport error',
});
