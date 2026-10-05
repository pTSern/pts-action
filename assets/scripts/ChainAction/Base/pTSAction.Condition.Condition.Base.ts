import { _decorator } from "cc";
import { pTSAsset } from "db://pts-core/scripts/pTSAsset";

const { ccclass, property } = _decorator

@ccclass('pTSAction_Condition_Condition_Base')
export abstract class pTSAction_Condition_Condition_Base extends pTSAsset {
    abstract check(map: Map<string, boolean>): boolean
}
