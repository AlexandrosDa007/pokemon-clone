export type SpriteItemType = 'MAP' | 'PLAYER_1' | 'EVIL_PLAYER';


export class SpriteLoader {
  static SPRITES: Record<SpriteItemType, SpriteLoaderItem> = {
    MAP: {} as SpriteLoaderItem,
    PLAYER_1: {} as SpriteLoaderItem,
    EVIL_PLAYER: {} as SpriteLoaderItem,
  };
  static ALL_LOADED = false;
}

interface SpriteLoaderItem {
  loaded: boolean;
  image: HTMLImageElement;
  width: number;
  height: number;
}
