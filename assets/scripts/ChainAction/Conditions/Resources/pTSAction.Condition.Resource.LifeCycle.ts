import { _decorator, Node, NodeEventType } from "cc";
import { pTSAction_Condition_Base } from "../../Base/pTSAction.Condition.Base";
import { menu, pGlobal, pLazy } from "db://pts-core/scripts/utils";

const { ccclass, property } = _decorator;

enum _EEvent {
    OnEnable = 1,
    OnDisable = 0,
}

pLazy.enums(_EEvent)

@ccclass('pTSAction_Condition_Resource_LifeCycle')
@menu('pTSAction/Condition/Resource/LifeCycle')
export class pTSAction_Condition_Resource_LifeCycle extends pTSAction_Condition_Base {
    @property({ type: _EEvent })
    event: _EEvent = _EEvent.OnEnable

    stop(): void {
    }

    init(origin: Node): void {
        origin.on(NodeEventType.ACTIVE_CHANGED, this._onActivated, this);
    }

    release(origin: Node): void {
        origin.off(NodeEventType.ACTIVE_CHANGED, this._onActivated, this);
    }

    protected _onActivated(target: Node, status: boolean) {
        const _is = this.event === Number(status);
        pGlobal.log({ group: "pTSAction-Manager", level: "DEV" }, `[pTSAction_Condition_Resource_LifeCycle] >> [_onActivated]`, target.name, status, this.uuid, _is);

        if(!target) return;
        _is && this._actReadyUp();
    }

}
