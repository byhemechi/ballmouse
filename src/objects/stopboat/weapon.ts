import { Vector } from "../../types"

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
    firerate: number;
    /** Timer for how long it has been since we shot */
    timer: number;
    /** Size of magazine */
    magsize: number;
    /** Time it takes to reload in seconds */
    reloadtime: number;
    /** How many bullets per shot, default to 1 */
    burstcount: number;
    /** Time between each burst shot in seconds */
    burstfirerate: number;
    /** Timer for how long it has been since last bullet fired */
    bursttimer: number;
}

export default class Weapon {
    damage: number;
    speed: number;
    spread: number;
    canFire: boolean = true;
    queue: number = 0;
    firerate: number;
    timer: number = 0;
    magsize: number;
    reloadtime: number;
    burstcount: number = 1;
    burstfirerate: number = 0;
    bursttimer: number = 0;

    constructor(options: Object = {}) {
        Object.assign(this, options);
    }
}