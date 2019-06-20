import { Vector } from "../../types"

/**
 * A container class that stores weapon data.
 * @param {Object}  options                 Options for the class; see below
 * @param {number}  options.damage          How much damage the bullets do
 * @param {number}  options.speed           Speed of bullets
 * @param {number}  options.spread          Spread of bullets in radians
 * @param {bool}    options.canFire         Flag if we can fire
 * @param {number}  options.queue           How many bullets left to fire
 * @param {number}  options.firerate        Time between each bullet in seconds
 * @param {number}  options.timer           Timer for how long it has been since we shot
 * @param {number}  options.magsize         Size of magazine
 * @param {number}  options.reloadtime      Time it takes to reload in seconds
 * @param {number}  options.burstcount      How many bullets per shot, default to 1
 * @param {number}  options.burstfirerate   Time between each burst shot in seconds
 * @param {number}  options.bursttimer      Timer for how long it has been since last bullet fired
 * 
 */

export default class Weapon {
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