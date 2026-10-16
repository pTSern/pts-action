
import { Tween, Node, _decorator, Vec3, v3, TweenEasing } from "cc";
import { pTSAction_Mechanic_Base } from "../../Base/pTSAction.Mechanic.Base";
import { Type_CCEasing } from "db://pts-core/scripts/Components/Type/Type.Easing";
import { Enums_EByTo } from "db://pts-core/scripts/helper/Enums/Enums.TweenOption";
import { menu } from "db://pts-core/scripts/utils";

const { ccclass, property } = _decorator

@ccclass('pTSAction_Mechanic_Resource_Scaling')
@menu('pTSAction/Mechanic/Resource/Scaling')
export class pTSAction_Mechanic_Resource_Scaling extends pTSAction_Mechanic_Base {
    @property({ type: Vec3 })
    target: Vec3 = v3()

    @property({ min: 0 })
    duration: number = 0;

    @property({ type: Enums_EByTo })
    type: Enums_EByTo = Enums_EByTo.To

    @property({ type: Type_CCEasing })
    easing: TweenEasing = 'smooth'

    tween(action: Tween<Node>): Tween<Node> {
        if(!action) return action;
        return action[this.type](this.duration, { scale: this.target }, { easing: this.easing })
    }

    stop(): void {
    }

}
