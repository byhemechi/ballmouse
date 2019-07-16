import Entity from "../../primitives/entity";
import Rect from "../../primitives/rect";
import { Vector } from "../../types";

export default class UI extends Entity {

    healthbarSize = 400;

    healthbarTimeBeforeDefill = 0.5;
    healthbarTimer = 0;
    healthbarCanDefill = false;
    healthbarDefillSpeed = 0.5; // Percent of health bar

    healthbar = new Rect({
        size: new Vector(this.healthbarSize, 30),
        position: new Vector(40, 40),
        fill: '#11bf45'
    });

    healthbarRed = new Rect({
        size: new Vector(this.healthbarSize, 30),
        position: new Vector(40, 40),
        fill: '#d62727'
    })

    healthbarUnder = new Rect({
        size: new Vector(this.healthbarSize, 30),
        position: new Vector(40, 40),
        fill: '#000'
    });
    
    children = [this.healthbarUnder, this.healthbarRed, this.healthbar]

    tick(delta) {
        this.healthbar.size.x = Math.max(this.healthbarSize * this.root.player.health / this.root.player.maxHealth, 0);

        if (!this.healthbarCanDefill && this.healthbarRed.size.x > this.healthbar.size.x && !this.healthbarTimer) {
            this.healthbarTimer = this.healthbarTimeBeforeDefill;
        }

        if (this.healthbarTimer) {
            this.healthbarTimer -= delta;
            if (this.healthbarTimer < 0) {
                this.healthbarTimer = 0;
                this.healthbarCanDefill = true;
            }
        }

        if (this.healthbarCanDefill) {
            this.healthbarRed.size.x -= delta * this.healthbarDefillSpeed * this.healthbarSize;

            if (this.healthbarRed.size.x < this.healthbar.size.x) {
                this.healthbarRed.size.x = this.healthbar.size.x;
                this.healthbarCanDefill = false;
            }
        }

    }

}