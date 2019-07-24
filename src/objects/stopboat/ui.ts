import Entity from "../../primitives/entity";
import Rect from "../../primitives/rect";
import { Vector } from "../../types";
import Label from "../../primitives/text";

class WeaponBox extends Rect {
    size = new Vector(72, 42);

    fill = '#0000';

    thickness = 3;
    borderFill = '#ddd';
    lineJoin = 'round'
    
}

export default class UI extends Entity {

    healthbarSize = 400;

    alpha = 1;
    aplhaChangeRate = 4;
    minAlpha = 0.2;
    maxY = 200;

    healthbarTimeBeforeDefill = 0.5;
    healthbarTimer = 0;
    healthbarCanDefill = false;
    healthbarDefillSpeed = 0.3; // Percent of health bar

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
        fill: '#000000'
    });

    healthbarOver = new Rect({
        size: new Vector(this.healthbarSize + 6, 36),
        position: new Vector(37, 37),
        fill: '#0000',
        thickness: 3,
        borderFill: '#000000ff',
        lineJoin: 'round'
    })

    weapons = new Entity({
        children: [
            new WeaponBox({
                position: new Vector(44, 100)
            }),
            new WeaponBox({
                position: new Vector(44 + 80, 100)
            }),
            new WeaponBox({
                position: new Vector(44 + 160, 100)
            }),
            new WeaponBox({
                position: new Vector(44 + 240, 100)
            }),
            new WeaponBox({
                position: new Vector(44 + 320, 100)
            }),
        ]
    });

    currentWeaponText = new Label({
        font: '24px sans-serif',
        value: '|',
        align: 'center',
        position: new Vector(0, 150),

        children: [
            new Label({
                font: '24px sans-serif',
                value: '0',
                align: 'right',
                position: new Vector(-6, 0)
            }),
            new Label({
                font: '24px sans-serif',
                value: '0',
                align: 'left',
                position: new Vector(6, 0)
            }),
        ]
    });
    
    children = [this.healthbarUnder, 
                this.healthbarRed, 
                this.healthbar,
                this.healthbarOver,
                this.weapons,
                this.currentWeaponText
                ]

    tick(delta) {
        this.updateHealthbar(delta);

        this.updateWeaponUI(delta);

        this.updateUIAlpha(delta);



    }

    private updateWeaponUI(delta: any) {
        // Set aliase to keep code shortish
        let player = this.root.player;
        let pw = player.currentWeapon;
        // Set the left text to how much ammo is in the weapon clip
        this.currentWeaponText.children[0].value = player.weapons[pw].magazine;
        // Set the right text to how much ammo of that type we have left
        this.currentWeaponText.children[1].value = player.ammo[player.weapons[pw].ammoType]
        // Set the offset of the label based on player weapon
        this.currentWeaponText.position.x = 80 + pw * 80;

    }


    /**
     * Checks if the player is under the UI and lower the opacity if so
     * @param delta 
     */
    private updateUIAlpha(delta: number) {
        // Updates healthbar alpha
        if (this.root.player.position.y < this.maxY && this.alpha > this.minAlpha) {
            this.alpha -= delta * this.aplhaChangeRate;
            if (this.alpha < this.minAlpha)
                this.alpha = this.minAlpha;
            this.updateHealthbarAlpha();
        }
        else if (this.root.player.position.y >= this.maxY && this.alpha < 1) {
            this.alpha += delta * this.aplhaChangeRate;
            if (this.alpha > 1)
                this.alpha = 1;
            this.updateHealthbarAlpha();
        }
    }

    /**
     * Updates the opacity of the healthbar
     */
    private updateHealthbarAlpha() {
        const alphaHex = Math.round(this.alpha * 255).toString(16);

        [this.healthbarUnder, this.healthbar, this.healthbarRed].forEach(i => {
            i.fill = i.fill.substr(0, 7) + alphaHex;
        });

        this.healthbarOver.borderFill = this.healthbarOver.borderFill.substr(0, 7) + alphaHex;
    }

    /**
     * Updates the healthbar value to that of player health
     * @param delta 
     */
    private updateHealthbar(delta: number) {
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