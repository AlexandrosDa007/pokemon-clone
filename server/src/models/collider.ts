import { BATTLE_MAP, CHANCE_TO_ENCOUNTER, COLLISION_MAP } from "@shared/constants/environment";
import { Rect } from "@shared/models/collisions";
import { rectCollision } from "@shared/utils/rect-collision";

export const enum CollisionEntry {
    WALL = 0,
    ENCOUNTER = 1,
}

export class Collider {
    rect: Rect
    constructor(rect: Rect) {
        this.rect = rect;
    }

    checkCollision(): CollisionEntry | null {
        const { x, y } = this.rect;
        const spotId = `${x}_${y}`;
        const spot = COLLISION_MAP[spotId];
        const encounterSpot = BATTLE_MAP[spotId];
        console.log({ encounterSpot });

        if (!spot && !encounterSpot) {
            return null;
        }
        console.log('I AM tryinmg');
        if (spot) {
            const isColliding = rectCollision(this.rect, spot)
            if (isColliding) {
                return CollisionEntry.WALL;
            }
        }
        // chance

        const isAboutToEncounter = rectCollision(this.rect, encounterSpot);
        if (isAboutToEncounter) {
            const random = Math.random();
            if (random > CHANCE_TO_ENCOUNTER) {
                return CollisionEntry.ENCOUNTER;
            }
        }
        return null;
    }
}

