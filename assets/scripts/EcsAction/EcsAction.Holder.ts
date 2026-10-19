import { _decorator } from "cc";
import { menu, pTSAsset } from "db://pts-core/scripts/utils";
import { EcsAction_Component } from "./EcsAction.Component";

const { ccclass } = _decorator;

@ccclass('EcsAction_Holder')
@menu('EcsAction/Holder')
export class EcsAction_Holder extends pTSAsset {
    protected _managers = new Set<EcsAction_Component>();
    get managers(): Set<EcsAction_Component> { return this._managers; }

    bind(manager: EcsAction_Component): void {
        this._managers.add(manager);
    }

    unbind(manager: EcsAction_Component): void {
        this._managers.delete(manager);
    }

    async wait(): Promise<void> {
        const activeManagers = Array.from(this._managers).filter(m => m.isValid && m.enabledInHierarchy);
        await Promise.all(activeManagers.map(m => m.wait()));
    }
}
