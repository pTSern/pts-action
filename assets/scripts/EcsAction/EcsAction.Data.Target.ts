import { Node } from "cc";
import { editor_ccclass, editor_property } from "db://pts-core/scripts/utils/pClass";

@editor_ccclass('EcsAction_Data_Target')
export class EcsAction_Data_Target {
    @editor_property()
    target: Node = null;

    @editor_property()
    origin: Node = null;
}
