import { _decorator, Node } from "cc";
import { menu } from "db://pts-core/scripts/pTSAsset";
import { editor_property } from "db://pts-core/scripts/utils/pClass";
import { EcsAction_Data_Condition_Base, EcsAction_Data_ConditionRef } from "./EcsAction.Data.Base";
import { EcsAction_Data_Chain } from "./EcsAction.Data.Chain";
import { EcsAction_System_Condition } from "./EcsAction.System.Condition";
import type { EcsAction_World } from "./EcsAction.World";

const { ccclass, property } = _decorator;

@ccclass('EcsAction_Data_Delay')
@menu('EcsAction/Data/Delay')
export class EcsAction_Data_Delay extends EcsAction_Data_Condition_Base {
    @property({ min: 0 })
    duration: number = 0;

    @editor_property()
    elapsed: number = 0;

    @editor_property()
    isReadyFlag: boolean = false;

    mount(world: EcsAction_World, entity: number, target: Node): void {
        world.ensureComponent(EcsAction_Data_Delay);
        world.ensureComponent(EcsAction_Data_ConditionRef);
        world.ensureSystem(EcsAction_System_Condition, [EcsAction_Data_Chain, EcsAction_Data_ConditionRef]);

        world.addComponent(entity, EcsAction_Data_Delay, this);

        let condRef = world.getComponent(entity, EcsAction_Data_ConditionRef);
        if (!condRef) {
            condRef = new EcsAction_Data_ConditionRef();
            world.addComponent(entity, EcsAction_Data_ConditionRef, condRef);
        }
        condRef.conditions.push(this);
    }

    isReady(world: EcsAction_World, entity: number): boolean {
        return this.isReadyFlag || (this.duration <= 0);
    }

    reset(world: EcsAction_World, entity: number): void {
        this.elapsed = 0;
        this.isReadyFlag = false;
    }
}
