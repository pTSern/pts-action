import { _decorator } from "cc";
import { pTSAction_Condition_Looper_Base } from "../../Base/pTSAction.Condition.Looper.Base";
import { pTSAction_Manager_Condition } from "../../Manager/pTSAction.Manager.Condition";

const { ccclass } = _decorator;

@ccclass('pTSAction_Condition_Looper_Instantly')
export class pTSAction_Condition_Looper_Instantly extends pTSAction_Condition_Looper_Base {
    reset(manager: pTSAction_Manager_Condition): Promise<boolean> {
        manager;
        return Promise.resolve(true);
    }
}
