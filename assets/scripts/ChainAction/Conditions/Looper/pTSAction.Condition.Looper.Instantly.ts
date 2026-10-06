import { _decorator } from "cc";
import { pTSAction_Condition_Looper_Base } from "../../Base/pTSAction.Condition.Looper.Base";
import { pTSAction_Manager_Condition } from "../../Manager/pTSAction.Manager.Condition";
import { menu } from "db://pts-core/scripts/utils";

const { ccclass } = _decorator;

@ccclass('pTSAction_Condition_Looper_Instantly')
@menu('pTSAction/Condition/Looper/Instantly')
export class pTSAction_Condition_Looper_Instantly extends pTSAction_Condition_Looper_Base {
    reset(manager: pTSAction_Manager_Condition): Promise<boolean> {
        manager;
        return Promise.resolve(true);
    }
}
