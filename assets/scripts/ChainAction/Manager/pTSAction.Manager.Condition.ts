import { _decorator, CCInteger, Node } from "cc";
import { pTSAction_Condition_Base } from "../Base/pTSAction.Condition.Base";
import { pTSAction_Manager_Base } from "./pTSAction.Manager.Base";
import { editor_property } from "db://pts-core/scripts/utils/pClass";
import { pTSAction_Condition_Condition_Base } from "../Base/pTSAction.Condition.Condition.Base";
import { pTSAction_Condition_Looper_Base } from "../Base/pTSAction.Condition.Looper.Base";
import { pClass } from "db://pts-core/scripts/utils";

const { ccclass, property  } = _decorator

@ccclass('pTSAction_Manager_Condition')
export class pTSAction_Manager_Condition extends pTSAction_Manager_Base<pTSAction_Condition_Base> {


    @property({ type: pTSAction_Condition_Condition_Base })
    condition: pTSAction_Condition_Condition_Base = null;

    @property({ min: 0, type: CCInteger })
    loop: number = 1

    @property({ type: pTSAction_Condition_Looper_Base, visible() { return this.loop !== 1 } })
    looper: pTSAction_Condition_Looper_Base = null

    @property({ min: 0, type: CCInteger })
    intMaxRunTime: number = 1

    @property({ type: pTSAction_Condition_Base, override: true })
    contents: pTSAction_Condition_Base[] = []

    @editor_property()
    protected _runtime: number = 0;

    @editor_property()
    protected _isMarkedToBeStop: boolean = false;
    protected _map: Map<string, boolean> = new Map();
    protected _ticks: pFlex.IBinder[] = []

    protected async _init(origin: Node) {
        this._check = this.intMaxRunTime > 0 ? () => this._runtime < this.intMaxRunTime : () => true
        const _promises = this.contents.map(async _content => {
            _content.init(origin);
            _content.tick && this._ticks.push({ func: _content.tick, binder: _content });
            await _content.ready;
            this._map.set(_content.uuid, false);
        })
        await Promise.all(_promises);
    }

    protected _ready() {
        if(this._isMarkedToBeStop) return;
        if(!this._check()) return

        this._runtime++;
        //this._driver.invoke('OnReady');

        if(!this._check()) return
        this.looper.reset(this).then(_status => _status && this._reset())
    }

    protected _check?(): boolean

    tick(dt: number) {
        pClass.emit(this._ticks, dt);
    }

    protected _reset() {
        this.contents.forEach(_content => {
            _content.reset();
            this._map.set(_content.uuid, false)
        });
    }

    protected _stop(): void {
        this._isMarkedToBeStop = true;
        this.contents.forEach(_content => _content.stop());
    }

    protected _released(): void {
    }
}
