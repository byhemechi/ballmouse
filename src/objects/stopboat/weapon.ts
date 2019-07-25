import { getSound, playSound } from "../../sound";

interface WeaponOptions {
    /** How much damage the bullets do */
    damage: number;
    /** Speed of bullets */
    speed: number;
    /** Spread of bullets in radians */
    spread: number;
    /** Flag if we can fire */
    canFire: boolean;
    /** How many bullets left to fire */
    queue: number;
    /** Time between each bullet in seconds */
    fireRate: number;
    /** Timer for how long it has been since we shot */
    timer: number;
    /** What type of ammo the weapon uses */
    ammoType: number;
    /** How many bullets fires per shot */
    shotCount: number;
    /** Is the shot spread random? */
    spreadIsRandom: number;
    /** Timer for how long it has been since last bullet fired */
    burstTimer: number;
    /** Max charge amount */
    chargeMax: number;
    /** Time to max charge */
    chargeTime: number;
    /** Charge timer */
    chargeTimer: number
    /** Path to shoot sound */
    shootSound: string;
}

export default class Weapon {
    damage: number;
    speed: number;
    spread: number;
    canFire: boolean = true;
    queue: number = 0;
    fireRate: number;
    timer: number = 0;
    ammoType: number = 0;
    spreadIsRandom: boolean = true;
    shotCount: number = 1;
    burstTimer: number = 0;
    chargeMax: number = 0;
    chargeTime: number = 0;
    chargeTimer: number = 0;
    shootSound: string;


    constructor(options: Object = {}) {
        Object.assign(this, options);
        getSound("shoot", this.shootSound);
    }

    playshoot() {
        playSound('shoot')
    }
}