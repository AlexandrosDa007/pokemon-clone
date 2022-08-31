import { COLLISION_MAP } from "@shared/constants/environment";
import { Rect } from "@shared/models/collisions";

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

function rectCollision(rect1: Rect, rect2: Rect) {
    if (rect1.x > rect2.x + rect2.width ||
        rect1.x + rect1.width < rect2.x ||
        rect1.y > rect2.y + rect2.height ||
        rect1.y + rect1.height < rect2.y) {
        return false;
    }
    return true;
}
