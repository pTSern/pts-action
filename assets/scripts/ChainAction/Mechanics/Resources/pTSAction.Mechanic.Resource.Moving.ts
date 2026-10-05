import { Tween, Node, _decorator, Vec3, v3, TweenEasing } from "cc";
import { pTSAction_Mechanic_Base } from "../../Base/pTSAction.Mechanic.Base";
import { Type_CCEasing } from "db://pts-core/scripts/Components/Type/Type.Easing";
import { Enums_EByTo } from "db://pts-core/scripts/helper/Enums/Enums.TweenOption";

const { ccclass, property } = _decorator

@ccclass('pTSAction_Mechanic_Resource_Moving')
export class pTSAction_Mechanic_Resource_Moving extends pTSAction_Mechanic_Base {
    @property({ type: Vec3 })
    pos: Vec3 = v3()

    @property({  })
    isWorldPos: boolean = false;

    @property({ min: 0 })
    duration: number = 0;

    @property({ type: Enums_EByTo })
    type: Enums_EByTo = Enums_EByTo.To

    @property({ type: Type_CCEasing })
    easing: TweenEasing = 'smooth'

    tween(action: Tween<Node>): Tween<Node> {
        return action[this.type]?.(this.duration, this.isWorldPos ? { worldPosition: this.pos } : { position: this.pos }, { easing: this.easing })
    }

    stop(): void {
    }

}
