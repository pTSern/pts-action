
import { _decorator, Node, tween, Tween } from "cc";
import { pTSAction_Manager_Base } from "./pTSAction.Manager.Base";
import { pTSAction_Mechanic_Base } from "../Base/pTSAction.Mechanic.Base";
import { editor_property } from "db://pts-core/scripts/utils/pClass";
import { pTSAction_Mechanic_Execution_Base } from "../Base/pTSAction.Mechanic.Execution.Base";
import { pGlobal } from "db://pts-core/scripts/utils";

const { ccclass, property  } = _decorator

interface _I {
    onComplete(manager: pTSAction_Manager_Mechanic): void
}

@ccclass('pTSAction_Manager_Mechanic')
export class pTSAction_Manager_Mechanic extends pTSAction_Manager_Base<pTSAction_Mechanic_Base, _I> {

    @property({ type: Node })
    target: Node = null;

    @property({ type: pTSAction_Mechanic_Execution_Base })
    execution: pTSAction_Mechanic_Execution_Base = null;

    @property({ })
    recalculation: boolean = false;

    @property({ })
    logger: boolean = false;

    @property({ type: pTSAction_Mechanic_Base, override: true })
    contents: pTSAction_Mechanic_Base[] = [];

    protected _tween: Tween<Node> = null;
    @editor_property()
    protected _executing: boolean = false;

    execute() {
        this.recalculation && ( this._tween = this.execution.generate(this._tween, this._contents, this.uuid) );

        this._tween?.start();
        this.logger && pGlobal.log({ group: "pTSAction-Manager", level: "DEV" }, `[pTSAction_Manager_Mechanic] >> Execute >>`, this.uuid, this._tween);
    }

    protected async _init() {
        this._tween = tween(this.target);
        this._tween = this.execution.generate(this._tween, this._contents, this.uuid);
        this._tween.call( () => {
            this._executing = false;
            this.emit('onComplete', this);
        } )
    }

    protected _stop(): void {
        this._tween?.stop();
        this._contents.forEach(_ => _.stop())
    }

    protected _released(): void {
        this.execution.release(this.uuid);
    }
}
