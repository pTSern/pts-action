import { _decorator } from "cc";
import { pTSAsset } from "db://pts-core/scripts/utils";
import { pTSAction_Manager_Condition } from "../Manager/pTSAction.Manager.Condition";

const { ccclass } = _decorator;

@ccclass('pTSAction_Condition_Looper_Base')
export abstract class pTSAction_Condition_Looper_Base extends pTSAsset {
    abstract reset(manager: pTSAction_Manager_Condition): Promise<boolean>
}
