import { _decorator, Tween, Node } from "cc";
import { pTSAsset } from "db://pts-core/scripts/utils";
import { pTSAction_Mechanic_Base } from "./pTSAction.Mechanic.Base";

const { ccclass } = _decorator;

@ccclass('pTSAction_Mechanic_Execution_Base')
export abstract class pTSAction_Mechanic_Execution_Base extends pTSAsset {
    abstract generate(tween: Tween<Node>, contents: pTSAction_Mechanic_Base[], uuid: string): Tween<Node>
    abstract release(uuid: string): void
}
