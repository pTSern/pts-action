import { v3, easing } from "cc";
import { _System, _ComponentManager } from "db://pts-core/scripts/utils/pECS";
import { editor_ccclass } from "db://pts-core/scripts/utils/pClass";
import { Enums_EByTo } from "db://pts-core/scripts/helper/Enums/Enums.TweenOption";
import { EcsAction_Data_Target } from "./EcsAction.Data.Target";
import { EcsAction_Data_Move } from "./EcsAction.Data.Move";
import { EcsAction_Data_Scale } from "./EcsAction.Data.Scale";

const _tempVec3 = v3();

@editor_ccclass('EcsAction_System_Move')
export class EcsAction_System_Move extends _System {
    update(dt: number, compMgr: _ComponentManager): void {
        for (const entity of this.entities) {
            const move = compMgr.get(entity, EcsAction_Data_Move);
            if (!move || !move.isActive || move.isDoneFlag) continue;

            const targetComp = compMgr.get(entity, EcsAction_Data_Target);
            if (!targetComp || !targetComp.target || !targetComp.target.isValid) {
                move.isDoneFlag = true;
                continue;
            }

            const node = targetComp.target;

            if (!move.isStarted) {
                move.startPos.set(move.isWorldPos ? node.worldPosition : node.position);
                move.isStarted = true;
                move.elapsed = 0;
            }

            move.elapsed += dt;
            const progress = move.duration > 0 ? Math.min(1, Math.max(0, move.elapsed / move.duration)) : 1;
            const easeFn = (easing as any)[move.easing] || easing.linear;
            const factor = easeFn(progress);

            if (move.type === Enums_EByTo.To) {
                _tempVec3.x = move.startPos.x + (move.pos.x - move.startPos.x) * factor;
                _tempVec3.y = move.startPos.y + (move.pos.y - move.startPos.y) * factor;
                _tempVec3.z = move.startPos.z + (move.pos.z - move.startPos.z) * factor;
            } else {
                _tempVec3.x = move.startPos.x + move.pos.x * factor;
                _tempVec3.y = move.startPos.y + move.pos.y * factor;
                _tempVec3.z = move.startPos.z + move.pos.z * factor;
            }

            if (move.isWorldPos) {
                node.setWorldPosition(_tempVec3);
            } else {
                node.setPosition(_tempVec3);
            }

            if (move.elapsed >= move.duration) {
                move.isDoneFlag = true;
            }
        }
    }
}

@editor_ccclass('EcsAction_System_Scale')
export class EcsAction_System_Scale extends _System {
    update(dt: number, compMgr: _ComponentManager): void {
        for (const entity of this.entities) {
            const scaleComp = compMgr.get(entity, EcsAction_Data_Scale);
            if (!scaleComp || !scaleComp.isActive || scaleComp.isDoneFlag) continue;

            const targetComp = compMgr.get(entity, EcsAction_Data_Target);
            if (!targetComp || !targetComp.target || !targetComp.target.isValid) {
                scaleComp.isDoneFlag = true;
                continue;
            }

            const node = targetComp.target;

            if (!scaleComp.isStarted) {
                scaleComp.startScale.set(node.scale);
                scaleComp.isStarted = true;
                scaleComp.elapsed = 0;
            }

            scaleComp.elapsed += dt;
            const progress = scaleComp.duration > 0 ? Math.min(1, Math.max(0, scaleComp.elapsed / scaleComp.duration)) : 1;
            const easeFn = (easing as any)[scaleComp.easing] || easing.linear;
            const factor = easeFn(progress);

            if (scaleComp.type === Enums_EByTo.To) {
                _tempVec3.x = scaleComp.startScale.x + (scaleComp.scale.x - scaleComp.startScale.x) * factor;
                _tempVec3.y = scaleComp.startScale.y + (scaleComp.scale.y - scaleComp.startScale.y) * factor;
                _tempVec3.z = scaleComp.startScale.z + (scaleComp.scale.z - scaleComp.startScale.z) * factor;
            } else {
                _tempVec3.x = scaleComp.startScale.x + scaleComp.scale.x * factor;
                _tempVec3.y = scaleComp.startScale.y + scaleComp.scale.y * factor;
                _tempVec3.z = scaleComp.startScale.z + scaleComp.scale.z * factor;
            }

            node.setScale(_tempVec3);

            if (scaleComp.elapsed >= scaleComp.duration) {
                scaleComp.isDoneFlag = true;
            }
        }
    }
}
