import { ViewPort } from "../viewport";
import { COLLISION_MAP } from '@shared/constants/environment';
import { Boundry } from "../boundary";


export function createBoundries(viewport: ViewPort) {
  const boundries: Boundry[] = Object.values(COLLISION_MAP).map(v => {
    return new Boundry({ x: v.x, y: v.y }, viewport);
  });
  return boundries;
}
