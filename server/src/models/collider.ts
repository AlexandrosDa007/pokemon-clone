import { COLLISION_MAP } from "@shared/constants/environment";
import { Rect } from "@shared/models/collisions";
import { rectCollision } from "@shared/utils/rect-collision";

export class Collider {
    rect: Rect
    constructor(rect: Rect) {
        this.rect = rect;
    }

    checkCollision() {
        const { x, y } = this.rect;
        const spotId = `${x}_${y}`;
        const spot = COLLISION_MAP[spotId];
        if (!spot) {
            return false;
        }
        return rectCollision(this.rect, spot)
    }
}

