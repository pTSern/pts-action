import { _decorator, CCInteger } from "cc";
import { pTSAction_Condition_Base } from "../../Base/pTSAction.Condition.Base";
import { editor_property } from "db://pts-core/scripts/utils/pClass";

const { ccclass, property, menu } = _decorator;

@ccclass('pTSAction_Condition_Resource_pTSEvent')
@menu("pTSAction/Condition/Resource/pTSEvent")
export class pTSAction_Condition_Resource_pTSEvent extends pTSAction_Condition_Base {
    @property({ type: CCInteger, min: 1 })
    amount: number = 1;

    @property({})
    event: string = 'any';

    @editor_property()
    protected _count: number = 0;

    stop(): void {
    }

    init(): void {
        this.on(this.event as any, this._onCalled, this);
    }

    protected _onCalled() {
        this._count++;
        if(this._count >= this.amount) {
            this._reset();
            this._actReadyUp();
        }
    }

    release(): void {
        this.off(this.event as any, this._onCalled, this);
    }

    protected _reset(): void {
        this._count = 0;
    }
}
