import Entity from "../../primitives/entity";
import Rect from "../../primitives/rect";
import { Vector } from "../../types";
import Label from "../../primitives/text";

class WeaponBox extends Rect {
    size = new Vector(120, 42);

    fill = '#00000000';

    thickness = 5;
    borderFill = '#ddddddff';
    lineJoin = 'round'

    children = [
        new Rect({
            size: new Vector(110, 32),
            fill: '#777777ff',
            position: new Vector(5,5)
        })
    ]
    
}

export default class UI extends Entity {

    healthbarSize = 400;
    blitzbarSize = 400;

    alpha = 1;
    aplhaChangeRate = 4;
    minAlpha = 0.1;
    maxY = 275;

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
        size: new Vector(this.healthbarSize+8, 30+8),
        position: new Vector(36, 36),
        fill: '#000000'
    });


    weapons = new Entity({
        position: new Vector(44, 125),
        children: [
            new WeaponBox,
            new WeaponBox({ position: new Vector(136, 0) }),
            new WeaponBox({ position: new Vector(272, 0)
            }),
        ]
    });

    currentWeaponText = new Label({
        font: '24px sans-serif',
        value: '0',
        align: 'center',
        position: new Vector(0, 175),
    });
    
    blitzMeter = new Rect({
        size: new Vector(this.blitzbarSize, 20),
        position: new Vector(40, 87.5),
        thickness: 20,
        borderFill: '#42b5ebff',
        lineJoin: 'round'
    });

    blitzMeterUnder = new Rect({
        size: new Vector(this.blitzbarSize, 20),
        position: new Vector(40, 87.5),
        thickness: 20,
        borderFill: '#052f42ff',
        lineJoin: 'round'
    });
    
    blitzMeterLabel = new Label({
        value: '1x',
        font: '16px sans-serif',
        position: new Vector(42, 90.5), 
    })

    children = [this.healthbarUnder, 
                this.healthbarRed, 
                this.healthbar,
                this.weapons,
                this.currentWeaponText,
                this.blitzMeterUnder,
                this.blitzMeter,
                this.blitzMeterLabel
                ]

    tick(delta) {
        this.updateHealthbar(delta);

        this.updateBlitzUI(delta);

        this.updateWeaponUI(delta);

        this.checkUpdateAlpha(delta);
    }

    private updateBlitzUI(delta: number) {
        this.blitzMeter.size.x = this.blitzbarSize * 
                                (this.root.scoreMultiplier - 0.5) / (this.root.maxScoreMultiplier - 0.5);
        this.blitzMeterLabel.value = (Math.floor(this.root.scoreMultiplier * 10) / 10).toFixed(1) + '×'
    }

    private updateWeaponUI(delta: number) {
        // Set aliase to keep code shortish
        let player = this.root.player;
        let pw = player.currentWeapon;
        // Set the text to how much ammo of that type we have left
        this.currentWeaponText.value = player.ammo[player.weapons[pw].ammoType]
        // Set the offset of the label based on player weapon
        this.currentWeaponText.position.x = 104 + pw * 136;
    }


    /**
     * Checks if the player is under the UI and lower the opacity if so
     * @param delta 
     */
    private checkUpdateAlpha(delta: number) {
        // Updates healthbar alpha
        if (this.root.player.position.y < this.maxY && this.alpha > this.minAlpha) {
            this.alpha -= delta * this.aplhaChangeRate;
            if (this.alpha < this.minAlpha)
                this.alpha = this.minAlpha;
            this.updateAlpha();
        }
        else if (this.root.player.position.y >= this.maxY && this.alpha < 1) {
            this.alpha += delta * this.aplhaChangeRate;
            if (this.alpha > 1)
                this.alpha = 1;
            this.updateAlpha();
        }
    }

    /**
     * Updates the opacity of the UI elements
     */
    private updateAlpha() {
        const alphaHex = Math.round(this.alpha * 255).toString(16);

        [this.healthbarUnder, this.healthbar, this.healthbarRed].forEach(i => {
            i.fill = i.fill.substr(0, 7) + alphaHex;
        });

        [this.blitzMeter, this.blitzMeterUnder].forEach(i => {
            i.borderFill = i.borderFill.substr(0, 7) + alphaHex;
        });
        
        this.weapons.children.forEach(i => {
            i.borderFill = i.borderFill.substr(0, 7) + alphaHex;
            i.children[0].fill = i.children[0].fill.substr(0, 7) + alphaHex; 
        });
    }

    /**
     * Updates the healthbar value to that of player health
     * @param delta 
     */
    private updateHealthbar(delta: number) {
        this.healthbar.size.x = Math.max(this.healthbarSize * this.root.player.health / this.root.player.maxHealth, 0);
        this.healthbarRed.size.x = Math.max(this.healthbarRed.size.x, this.healthbar.size.x);

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