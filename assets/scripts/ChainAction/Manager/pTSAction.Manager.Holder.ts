import { _decorator } from "cc";
import { menu, pTSAsset } from "db://pts-core/scripts/utils";
import { pTSAction_Manager_Component } from "./pTSAction.Manager.Component";

const { ccclass } = _decorator

@ccclass('pTSAction_Manager_Holder')
@menu('pTSAction/Manager/Holder')
export class pTSAction_Manager_Holder extends pTSAsset {
    protected _managers = new Set<pTSAction_Manager_Component>();
    get manager() { return this._managers }

    bind(manager: pTSAction_Manager_Component) {
        this._managers.add(manager);
    }

    unbind(manager: pTSAction_Manager_Component) {
        this._managers.delete(manager);
    }

    async wait(): Promise<void> {
        const managers = Array.from(this._managers).filter(manager => manager.isValid && manager.enabledInHierarchy);
        await Promise.all(managers.map(manager => manager.wait()));
    }
}
