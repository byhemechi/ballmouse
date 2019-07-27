import { getSound, playSound } from "../../sound";
import { Vector } from "../../types";

interface WeaponOptions {
    /** How much damage the bullets do */
    damage: number;
    /** Speed of bullets */
    speed: number;
    /** Angular spread of bullets in radians */
    angularSpread: number;
    /** Linear spread of bullets */
    linearSpread: number;
    /** How much tilt there is in correlation to player input */
    tilt: number;
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
    /** Path to bullet sprite */
    src: string;
    /** Size of bullet sprite */
    spriteSize: Vector;
    /** Range of bullet destroying; disabled by default */
    bulletDestroyRadius: number;
}

export default class Weapon {
    damage: number = 0;
    speed: number = 0;
    angularSpread: number = 0;
    linearSpread: number = 0;
    tilt: number = 0;
    canFire: boolean = true;
    queue: number = 0;
    fireRate: number = 1;
    timer: number = 0;
    ammoType: number = 0;
    spreadIsRandom: boolean = true;
    shotCount: number = 1;
    burstTimer: number = 0;
    chargeMax: number = 0;
    chargeTime: number = 0;
    chargeTimer: number = 0;
    shootSound: string;
    src: string = "/assets/stopboat/bullet.png";
    spriteSize: Vector;
    bulletDestroyRadius: number = 0;
    id: string;

    constructor(options: Object = {}) {
        Object.assign(this, options);
        
        this.id = btoa(crypto.getRandomValues(new Uint8Array(4)).join(""))
        getSound(this.id + "shoot", this.shootSound);
    }

    playshoot() {
        playSound(this.id + 'shoot')
    }
}