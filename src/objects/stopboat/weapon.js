import { Vector } from "../../types"

/**
 * Weapon class
 * @param {Object}  options                 Options for the class; see below
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
    constructor(options) {
        this.speed = options.speed;
        this.spread = options.spread;
        this.canFire = true;
        this.queue = 0;
        this.firerate = options.firerate;
        this.timer = 0;
        this.magsize = options.magsize;
        this.reloadtime = options.reloadtime;
        this.burstcount = options.burstcount || 1;
        this.burstfirerate = options.burstfirerate || 0;
        this.bursttimer = 0
    }
}