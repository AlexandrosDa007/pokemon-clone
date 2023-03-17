export const SOCKET_EVENTS = Object.freeze({
  STATE_CHANGE: 'stateChange',
  CONNECTION: 'connection',
  DISCONNECT: 'disconnect',
  KEY: 'key',
  BATTLE_INVITES: 'battleInvites',
  INVITE_TO_BATTLE: 'inviteToBattle',
  ENCOUNTER: 'encounter',
  ENCOUNTER_ACKNOWLEDGED: 'encounterAcknowledged',
  POSITION_ACKNOWLEDGED: 'positionAcknowledged',
  NEW_POSITION: 'newPosition',
  NEW_OTHER_PLAYER_POS: 'newOtherPlayerPos',
  FINISH_MOVEMENT: 'finishMovement',
  INITIAL_STATE: 'initialState',
});

export const SOCKET_DISCONNECT_REASONS = Object.freeze({
  SERVER_DISCONNECT: 'io server disconnect',
  CLIENT_DISCONNECT: 'io client disconnect',
  PING_TIMEOUT: 'ping timeout',
  TRANSPORT_CLOSE: 'transport close',
  TRANSPORT_ERROR: 'transport error',
});
