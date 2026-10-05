
import { _decorator } from "cc";
import { pTSAction_Condition_Condition_Base } from "../../Base/pTSAction.Condition.Condition.Base";

const { ccclass } = _decorator

@ccclass('pTSAction_Condition_Condition_Or')
export class pTSAction_Condition_Condition_Or extends pTSAction_Condition_Condition_Base {
    check(map: Map<string, boolean>): boolean {
        let _is = false;
        map.forEach(_status => _is = _status);
        return _is
    }
}
