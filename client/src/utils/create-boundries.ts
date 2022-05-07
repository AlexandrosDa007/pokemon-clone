import { COLLISION_MAP } from '@shared/constants/environment';
import { Boundry } from "../boundary";

/**
 * Create the boundries for the map
 */
export function createBoundries() {
  const boundries: Boundry[] = Object.values(COLLISION_MAP).map(v => {
    return new Boundry({ x: v.x, y: v.y });
  });
  return boundries;
}
