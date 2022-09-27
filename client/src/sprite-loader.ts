export type SpriteItemType =
  | 'MAP'
  | 'PLAYER_1'
  | 'EVIL_PLAYER'
  | 'EX_MARK'
  | 'ARROW_RIGHT';

export class SpriteLoader {
  static SPRITES: Record<SpriteItemType, SpriteLoaderItem> = {
    MAP: {} as SpriteLoaderItem,
    PLAYER_1: {} as SpriteLoaderItem,
    EVIL_PLAYER: {} as SpriteLoaderItem,
    EX_MARK: {} as SpriteLoaderItem,
    ARROW_RIGHT: {} as SpriteLoaderItem,
  };
  static ALL_LOADED = false;
}

interface SpriteLoaderItem {
  loaded: boolean;
  image: HTMLImageElement;
  width: number;
  height: number;
}
