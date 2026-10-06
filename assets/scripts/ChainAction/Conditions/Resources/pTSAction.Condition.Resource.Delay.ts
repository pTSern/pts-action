import { _decorator, Node } from "cc";
import { pTSAction_Condition_Base } from "../../Base/pTSAction.Condition.Base";
import { editor_property } from "db://pts-core/scripts/utils/pClass";
import { menu } from "db://pts-core/scripts/utils";

const { ccclass, property } = _decorator;

@ccclass('pTSAction_Condition_Resource_Delay')
@menu('pTSAction/Condition/Resource/Delay')
export class pTSAction_Condition_Resource_Delay extends pTSAction_Condition_Base {
    @property({ min: 0 })
    duration: number = 0;

    @editor_property()
    protected _tick: number = 0;

    @editor_property()
    protected _stoped: boolean = false;

    stop(): void {
        this._stoped = true;
    }

    init(origin: Node): void {
        origin;
    }

    release(origin: Node): void {
        origin;
    }

    tick(dt: number): void {
        if(this._stoped || this._ready) return;
        this._tick += dt;

        if(this._tick >= this.duration) {
            this._actReadyUp();
        }
    }

    protected _reset(): void {
        this._tick = 0;
        this._stoped = false;
    }

}
