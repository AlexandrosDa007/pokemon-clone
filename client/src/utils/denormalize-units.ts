import { Position } from "@shared/models/position";
import { SCALED_SIZE } from "../constants/environment";

export function denormalizeUnits(pos: Position) {
    return {
        x: pos.x * SCALED_SIZE,
        y: pos.y * SCALED_SIZE,
    };
}
