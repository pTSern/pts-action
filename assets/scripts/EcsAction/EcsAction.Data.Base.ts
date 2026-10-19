import { _decorator, Node } from "cc";
import { pTSAsset } from "db://pts-core/scripts/pTSAsset";
import { editor_ccclass, editor_property } from "db://pts-core/scripts/utils/pClass";
import type { EcsAction_World } from "./EcsAction.World";

const { ccclass, property } = _decorator;

@ccclass('EcsAction_Data_Base')
export abstract class EcsAction_Data_Base extends pTSAsset {
    @property({ })
    enabled: boolean = true;

    /**
     * Mounts this action configuration onto the target entity in the ECS world.
     */
    abstract mount(world: EcsAction_World, entity: number, target: Node): void;

    /**
     * Returns true when this action has completed its execution.
     */
    abstract isDone(world: EcsAction_World, entity: number): boolean;

    /**
     * Resets internal state on the entity for looping.
     */
    abstract reset(world: EcsAction_World, entity: number): void;
}

@ccclass('EcsAction_Data_Condition_Base')
export abstract class EcsAction_Data_Condition_Base extends EcsAction_Data_Base {
    abstract isReady(world: EcsAction_World, entity: number): boolean;

    isDone(world: EcsAction_World, entity: number): boolean {
        return this.isReady(world, entity);
    }
}

@ccclass('EcsAction_Data_Mechanic_Base')
export abstract class EcsAction_Data_Mechanic_Base extends EcsAction_Data_Base {
    @editor_property()
    isActive: boolean = false;
}

@editor_ccclass('EcsAction_Data_MechanicRef')
export class EcsAction_Data_MechanicRef {
    action: EcsAction_Data_Mechanic_Base = null;
}

@editor_ccclass('EcsAction_Data_ConditionRef')
export class EcsAction_Data_ConditionRef {
    conditions: EcsAction_Data_Condition_Base[] = [];
}
