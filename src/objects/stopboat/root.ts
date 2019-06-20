// Import classes
import Entity from "../../primitives/entity";
import Rect from "../../primitives/rect";
import { Vector } from "../../types";
import Sprite from "../../primitives/sprite";
import Player from "./player"

// Makes it so you dont need 'Math.' before math functions
const {sin, cos, tan, PI, random} = Math;

export default class Root extends Entity {
    children = [new Player];
    
    tick(delta) {
        super.tick(delta);
    }
}

