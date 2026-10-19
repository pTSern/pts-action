import { _System, _ComponentManager } from "db://pts-core/scripts/utils/pECS";
import { editor_ccclass } from "db://pts-core/scripts/utils/pClass";
import { EcsAction_Data_Chain } from "./EcsAction.Data.Chain";
import { EcsAction_Data_Sequence, EcsAction_EExecutionMode } from "./EcsAction.Data.Sequence";
import { EcsAction_Data_MechanicRef, EcsAction_Data_ConditionRef } from "./EcsAction.Data.Base";
import { EcsAction_World } from "./EcsAction.World";

@editor_ccclass('EcsAction_System_Sequence')
export class EcsAction_System_Sequence extends _System {
    update(dt: number, compMgr: _ComponentManager): void {
        for (const entity of this.entities) {
            const chain = compMgr.get(entity, EcsAction_Data_Chain);
            if (!chain || chain.isMarkedToStop || chain.state !== 'executing') continue;

            const seq = compMgr.get(entity, EcsAction_Data_Sequence);
            if (!seq) continue;

            if (seq.mode === EcsAction_EExecutionMode.SEQUENCE) {
                if (seq.childEntities.length === 0) {
                    seq.isDone = true;
                } else if (seq.currentStepIndex < seq.childEntities.length) {
                    const currentChild = seq.childEntities[seq.currentStepIndex];
                    seq.setChildActive(currentChild, compMgr, true);

                    if (this._isChildDone(currentChild, compMgr)) {
                        seq.setChildActive(currentChild, compMgr, false);
                        seq.currentStepIndex++;

                        if (seq.currentStepIndex < seq.childEntities.length) {
                            seq.setChildActive(seq.childEntities[seq.currentStepIndex], compMgr, true);
                        } else {
                            seq.isDone = true;
                        }
                    }
                }
            } else {
                // Parallel mode: all children must be done
                let allDone = true;
                for (const child of seq.childEntities) {
                    seq.setChildActive(child, compMgr, true);
                    if (!this._isChildDone(child, compMgr)) {
                        allDone = false;
                    }
                }
                if (allDone) {
                    seq.isDone = true;
                }
            }

            if (seq.isDone) {
                this._handleSequenceCompletion(entity, chain, seq, compMgr);
            }
        }
    }

    private _isChildDone(childEntity: number, compMgr: _ComponentManager): boolean {
        try {
            const ref = compMgr.get(childEntity, EcsAction_Data_MechanicRef);
            if (ref && ref.action) {
                return ref.action.isDone(EcsAction_World.instance, childEntity);
            }
        } catch { /* No mechanic ref */ }

        return true;
    }

    private _handleSequenceCompletion(
        entity: number,
        chain: EcsAction_Data_Chain,
        seq: EcsAction_Data_Sequence,
        compMgr: _ComponentManager
    ): void {
        chain.loopCount++;

        const isMaxRuntimeReached = chain.maxRuntime > 0 && chain.runtime >= chain.maxRuntime;
        const canLoopAgain = !isMaxRuntimeReached && (chain.maxLoops === 0 || chain.loopCount < chain.maxLoops);

        if (canLoopAgain) {
            // Deactivate all children and reset sequence state
            seq.deactivateAll(compMgr);
            seq.currentStepIndex = 0;
            seq.isDone = false;

            // Reset child entities polymorphically
            for (const child of seq.childEntities) {
                this._resetChild(child, compMgr);
            }

            // Reset conditions if attached
            let hasConditions = false;
            try {
                const condRef = compMgr.get(entity, EcsAction_Data_ConditionRef);
                if (condRef && condRef.conditions.length > 0) {
                    hasConditions = true;
                    for (const cond of condRef.conditions) {
                        cond.reset(EcsAction_World.instance, entity);
                    }
                }
            } catch { /* No condition ref */ }

            chain.state = hasConditions ? 'evaluating' : 'executing';
            if (chain.state === 'executing') {
                seq.activateCurrent(compMgr);
            }
        } else {
            seq.deactivateAll(compMgr);
            chain.state = 'completed';
            chain.onComplete?.();
        }
    }

    private _resetChild(childEntity: number, compMgr: _ComponentManager): void {
        try {
            const ref = compMgr.get(childEntity, EcsAction_Data_MechanicRef);
            if (ref && ref.action) {
                ref.action.reset(EcsAction_World.instance, childEntity);
            }
        } catch { /* Ignored */ }
    }
}
