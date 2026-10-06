import { Tween, Node, _decorator } from "cc";
import { pTSAction_Mechanic_Execution_Base } from "../../Base/pTSAction.Mechanic.Execution.Base";
import { pTSAction_Mechanic_Base } from "../../Base/pTSAction.Mechanic.Base";
import { menu } from "db://pts-core/scripts/utils";

const { ccclass } = _decorator;

@ccclass('pTSAction_Mechanic_Execution_Sequence')
@menu('pTSAction/Mechanic/Execution/Sequence')
export class pTSAction_Mechanic_Execution_Sequence extends pTSAction_Mechanic_Execution_Base {
    release(uuid: string): void {
        uuid;
    }

    generate(tween: Tween<Node>, contents: pTSAction_Mechanic_Base[]): Tween<Node> {
        for(const _content of contents) {
            tween = _content.tween(tween);
        }
        return tween;
    }

}
