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
    /** Size of magazine */
    magazineSize: number;
    /** What type of ammo the weapon uses */
    ammoType: number
    /** Time it takes to reload in seconds */
    reloadTime: number;
    /** How many bullets per shot, default to 1 */
    burstCount: number;
    /** Time between each burst shot in seconds */
    burstFireRate: number;
    /** Timer for how long it has been since last bullet fired */
    burstTimer: number;
    /** Path to shoot sound */
    shootSound: string;
    /** Path to reload sound */
    reloadSound: string;
}

export default class Weapon {
    damage: number;
    speed: number;
    spread: number;
    canFire: boolean = true;
    queue: number = 0;
    fireRate: number;
    timer: number = 0;
    magazine: number;
    magazineSize: number;
    ammoType: number = 0;
    reloadTime: number;
    reloadTimer: number = 0;
    burstCount: number = 1;
    burstFireRate: number = 0;
    burstTimer: number = 0;
    shootSound: string;
    reloadSound: string;


    constructor(options: Object = {}) {
        Object.assign(this, options);
        this.magazine = this.magazineSize;
        getSound("shoot", this.shootSound);
        getSound("reload", this.reloadSound);
    }

    playshoot() {
        playSound('shoot')
    }
    
    playreload() {
        playSound('reload')
    }
}