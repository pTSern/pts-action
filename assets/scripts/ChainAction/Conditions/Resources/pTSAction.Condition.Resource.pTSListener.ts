import { _decorator, CCInteger } from "cc";
import { pTSAction_Condition_Base } from "../../Base/pTSAction.Condition.Base";
import { menu, pTSAsset } from "db://pts-core/scripts/utils";
import { editor_property } from "db://pts-core/scripts/utils/pClass";

const { ccclass, property } = _decorator

@ccclass('pTSAction_Condition_Resource_pTSListener')
@menu("pTSAction/Condition/Resource/pTSListener")
export class pTSAction_Condition_Resource_pTSListener extends pTSAction_Condition_Base {
    @property({ type: pTSAsset })
    asset: pTSAsset = null;

    @property({ })
    event: string = '';

    @property({ type: CCInteger, min: 1 })
    amount: number = 1;

    @editor_property()
    protected _count: number = 0;

    stop(): void {
    }

    init(): void {
        if(!this.asset) return;

        this.asset.on(this.event as any, this._onCalled, this);
    }

    protected _onCalled() {
        this._count++;
        if(this._count >= this.amount) {
            this._reset();
            this._actReadyUp();
        }
    }

    release(): void {
        this.asset?.off(this.event as any, this._onCalled, this);
    }

    protected _reset(): void {
        this._count = 0;
    }
}
