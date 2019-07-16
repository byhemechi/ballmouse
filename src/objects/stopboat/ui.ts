import Entity from "../../primitives/entity";
import Rect from "../../primitives/rect";
import { Vector } from "../../types";

export default class UI extends Entity {

    healthbarSize = 400;

    healthbar = new Rect({
        size: new Vector(this.healthbarSize, 30),
        position: new Vector(40, 40)

    });
    
    children = [
        this.healthbar
    ]

}