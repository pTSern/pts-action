import { pLazy } from "db://pts-core/scripts/utils";
import { editor_ccclass, editor_property } from "db://pts-core/scripts/utils/pClass";
import type { _ComponentManager } from "db://pts-core/scripts/utils/pECS";
import { EcsAction_Data_MechanicRef } from "./EcsAction.Data.Base";

export enum EcsAction_EExecutionMode {
    SEQUENCE = 'sequence',
    PARALLEL = 'parallel'
}

pLazy.enums(EcsAction_EExecutionMode);

@editor_ccclass('EcsAction_Data_Sequence')
export class EcsAction_Data_Sequence {
    @editor_property(EcsAction_EExecutionMode)
    mode: EcsAction_EExecutionMode = EcsAction_EExecutionMode.SEQUENCE;

    @editor_property()
    childEntities: number[] = [];

    @editor_property()
    currentStepIndex: number = 0;

    @editor_property()
    isDone: boolean = false;

    activateCurrent(compMgr: _ComponentManager): void {
        if (this.mode === EcsAction_EExecutionMode.PARALLEL) {
            for (const child of this.childEntities) {
                this.setChildActive(child, compMgr, true);
            }
        } else {
            if (this.currentStepIndex < this.childEntities.length) {
                this.setChildActive(this.childEntities[this.currentStepIndex], compMgr, true);
            }
        }
    }

    deactivateAll(compMgr: _ComponentManager): void {
        for (const child of this.childEntities) {
            this.setChildActive(child, compMgr, false);
        }
    }

    setChildActive(childEntity: number, compMgr: _ComponentManager, active: boolean): void {
        try {
            const ref = compMgr.get(childEntity, EcsAction_Data_MechanicRef);
            if (ref && ref.action) {
                ref.action.isActive = active;
            }
        } catch { /* ignored */ }
    }
}
