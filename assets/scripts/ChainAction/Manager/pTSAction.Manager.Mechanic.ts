
import { _decorator, Node, tween, Tween } from "cc";
import { pTSAction_Manager_Base } from "./pTSAction.Manager.Base";
import { pTSAction_Mechanic_Base } from "../Base/pTSAction.Mechanic.Base";
import { editor_property } from "db://pts-core/scripts/utils/pClass";
import { pTSAction_Mechanic_Execution_Base } from "../Base/pTSAction.Mechanic.Execution.Base";

const { ccclass, property  } = _decorator

@ccclass('pTSAction_Manager_Mechanic')
export class pTSAction_Manager_Mechanic extends pTSAction_Manager_Base<pTSAction_Mechanic_Base> {

    @property({ type: Node })
    target: Node = null

    @property({ type: pTSAction_Mechanic_Execution_Base })
    execution: pTSAction_Mechanic_Execution_Base = null

    @property({ })
    recalculation: boolean = false

    @property({ type: pTSAction_Mechanic_Base, override: true })
    contents: pTSAction_Mechanic_Base[] = []

    protected _tween: Tween<Node> = null
    @editor_property()
    protected _executing: boolean = false;

    execute() {
        this.recalculation && ( this._tween = this.execution.generate(this._tween, this.contents, this.uuid) );

        this._tween?.start();
    }

    protected async _init() {
        this._tween = this.execution.generate(this._tween, this.contents, this.uuid);
    }

    protected _stop(): void {
        this._tween?.stop();
        this.contents.forEach(_ => _.stop())
    }

    protected _released(): void {
        this.execution.release(this.uuid);
    }
}
