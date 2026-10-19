import { Enum } from "cc";
import { editor_ccclass, editor_property } from "db://pts-core/scripts/utils/pClass";

export type TEcsActionState = 'idle' | 'evaluating' | 'executing' | 'completed';

export enum EEcsConditionLogic {
    AND = 'and',
    OR = 'or',
}

Enum(EEcsConditionLogic);

@editor_ccclass('EcsAction_Data_Chain')
export class EcsAction_Data_Chain {
    @editor_property()
    state: TEcsActionState = 'idle';

    @editor_property()
    loopCount: number = 0;

    @editor_property()
    maxLoops: number = 1;

    @editor_property()
    runtime: number = 0;

    @editor_property()
    maxRuntime: number = 1;

    @editor_property()
    conditionLogic: EEcsConditionLogic = EEcsConditionLogic.AND;

    @editor_property()
    isMarkedToStop: boolean = false;

    onComplete?: () => void;
}
