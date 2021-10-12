
import { CoordData } from "../Coord";

function lerp(start: number, end: number, time: number) {
    return start * (1 - time) + end * time;
}


export default class LocationTween {
    // duration expressed in millis
    private from: CoordData;
    private to: CoordData;
    private tweening: boolean = false;
    private _start: number = performance.now();
    private frameId:number = -1;

    constructor(
        from: CoordData, 
        to: CoordData, 
        private duration: number, 
        private stepCB: (number) => void, 
        private completeCB: (MyCoord) => void) 
    {
        this.from = from!.slice() as CoordData;
        this.to = to!.slice() as CoordData;
        this.duration = duration;
    }

    get isTweening(){
        return this.tweening;
    }

    start() {
        if (this.tweening) return;
        this._start = performance.now();
        this.frameId = window.requestAnimationFrame(this.step.bind(this));
        this.tweening = true;
    }

    stop() {
        window.cancelAnimationFrame(this.frameId);
        this.tweening = false;
    }

    step(timestamp) {
        if (this.start === undefined) {
            this.start = timestamp;
        }
        const elapsed = timestamp - this._start;

        const t = elapsed / this.duration;

        const x = lerp(this.from[0], this.to[0], t);
        const y = lerp(this.from[1], this.to[1], t);
        const next = [x, y];
        // console.log(next);

        if (this.stepCB) {
            this.stepCB(next);
        }

        if (elapsed < this.duration) { 
            this.frameId = window.requestAnimationFrame(this.step.bind(this));
        }else{
            this.completeCB(this.to);
        }
    }
}