import { _System, _ComponentManager } from "db://pts-core/scripts/utils/pECS";
import { editor_ccclass } from "db://pts-core/scripts/utils/pClass";
import { EcsAction_Data_Chain, EEcsConditionLogic } from "./EcsAction.Data.Chain";
import { EcsAction_Data_ConditionRef } from "./EcsAction.Data.Base";
import { EcsAction_Data_Delay } from "./EcsAction.Data.Delay";
import { EcsAction_Data_Sequence } from "./EcsAction.Data.Sequence";
import { EcsAction_World } from "./EcsAction.World";

@editor_ccclass('EcsAction_System_Condition')
export class EcsAction_System_Condition extends _System {
    update(dt: number, compMgr: _ComponentManager): void {
        const world = EcsAction_World.instance;

        for (const entity of this.entities) {
            const chain = compMgr.get(entity, EcsAction_Data_Chain);
            if (!chain || chain.isMarkedToStop || chain.state !== 'evaluating') continue;

            const condRef = compMgr.get(entity, EcsAction_Data_ConditionRef);
            if (!condRef || condRef.conditions.length === 0) {
                this._onConditionsSatisfied(entity, chain, compMgr);
                continue;
            }

            const activeConditions = condRef.conditions.filter(c => c && c.enabled);
            if (activeConditions.length === 0) {
                this._onConditionsSatisfied(entity, chain, compMgr);
                continue;
            }

            // Advance time/delay clocks for conditions
            for (const cond of activeConditions) {
                if (cond instanceof EcsAction_Data_Delay) {
                    if (!cond.isReadyFlag) {
                        cond.elapsed += dt;
                        if (cond.elapsed >= cond.duration) {
                            cond.isReadyFlag = true;
                        }
                    }
                }
            }

            // Evaluate condition satisfaction according to AND / OR logic
            let isSatisfied = false;
            if (chain.conditionLogic === EEcsConditionLogic.OR) {
                isSatisfied = activeConditions.some(c => c.isReady(world, entity));
            } else {
                isSatisfied = activeConditions.every(c => c.isReady(world, entity));
            }

            if (isSatisfied) {
                this._onConditionsSatisfied(entity, chain, compMgr);
            }
        }
    }

    private _onConditionsSatisfied(entity: number, chain: EcsAction_Data_Chain, compMgr: _ComponentManager): void {
        chain.state = 'executing';
        chain.runtime++;

        // Wake the active mechanics via the sequence manager
        try {
            const seq = compMgr.get(entity, EcsAction_Data_Sequence);
            if (seq) {
                seq.activateCurrent(compMgr);
            }
        } catch { /* No sequence attached */ }
    }
}
