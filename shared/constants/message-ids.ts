export type MessageId = 'KEY' | 'OVERWORLD_STATE' | 'BATTLE_STATE' | 'CREATE_BATTLE';

export const MESSAGE_IDS: Record<MessageId, MessageId> = {
    KEY: 'KEY',
    OVERWORLD_STATE: 'OVERWORLD_STATE',
    BATTLE_STATE: 'BATTLE_STATE',
    CREATE_BATTLE: 'CREATE_BATTLE',
};
