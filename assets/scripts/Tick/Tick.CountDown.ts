import { _decorator, CCInteger } from "cc";
import { Smart_StartUp } from "../Smart/Smart.StartUp";
import { pConst } from "db://pts-core/scripts/utils";
import { editor_property } from "db://pts-core/scripts/utils/pClass";
import { Event_Flexer } from "db://pts-core/scripts/Components/Event/Event.Flexer";

const { ccclass, property } = _decorator;

@ccclass("Tick_CountDown")
export class Tick_CountDown extends Smart_StartUp {

    @property({ type: CCInteger, min: 0, group: pConst.GROUPS.CORE })
    duration: number = 60;

    @property({ type: Event_Flexer, group: pConst.GROUPS.EVENT })
    onTick: Event_Flexer = new Event_Flexer();

    @property({ type: Event_Flexer, group: pConst.GROUPS.EVENT })
    onComplete: Event_Flexer = new Event_Flexer();

    @editor_property()
    protected _tick: number = 0;

    @editor_property()
    protected _started: boolean = false;

    protected _onExecute(): Promise<void> | void {
        this._started = true;
    }

    protected update(dt: number): void {
        if (!this._started) return;
        this._tick += dt;

        this.onTick.emit(this._tick, this.duration);

        if(this._tick >= this.duration) {
            this._started = false;
            this.onComplete.emit(this._tick, this.duration);
        }
    }

    protected _onStop(): void {
        this._started = false;
        this._tick = 0;
    }

    protected _onPause(): void {
        this._started = false;
    }

    protected _onResume(): void {
        this._started = true;
    }
}
