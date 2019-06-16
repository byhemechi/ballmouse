// Import classes
import Entity from "../../primitives/entity.js";
import Rect from "../../primitives/rect.js";
import { Vector } from "../../types.js";
import Sprite from "../../primitives/sprite";
import Player from "../stopboat/player"

// Makes it so you dont need 'Math.' before math functions
const {sin, cos, tan, PI, random} = Math;

export default class Root extends Entity {
    children = [new Player];
    
    tick(delta) {
        super.tick(delta);
    }
}

