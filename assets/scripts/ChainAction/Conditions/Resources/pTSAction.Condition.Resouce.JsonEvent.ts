import { _decorator, CCInteger, JsonAsset, Node } from "cc";
import { pTSAction_Condition_Base } from "../../Base/pTSAction.Condition.Base";
import { menu, pEngine } from "db://pts-core/scripts/utils";
import { editor_property } from "db://pts-core/scripts/utils/pClass";

const { ccclass, property } = _decorator

@ccclass('pTSAction_Condition_Resource_JsonEvent')
@menu('pTSAction/Condition/Resource/JsonEvent')
export class pTSAction_Condition_Resource_JsonEvent extends pTSAction_Condition_Base {
    @property({ type: JsonAsset })
    asset: JsonAsset = null;

    @property({ type: CCInteger, min: 1 })
    amount: number = 1;

    @editor_property()
    protected _count: number = 0;

    stop(): void {
    }

    init(origin: Node): void {
        origin;
        pEngine.Json.event.add(this.asset, { func: this._onCalled, binder: this });
    }

    protected _onCalled() {
        this._count++;
        if(this._count >= this.amount) {
            this._reset();
            this._actReadyUp();
        }
    }

    protected _reset(): void {
        this._count = 0;
    }

    release(origin: Node): void {
        origin;
        pEngine.Json.event.remove(this.asset, { func: this._onCalled, binder: this });
    }
}
