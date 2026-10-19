import { Vec3, v3, TweenEasing, _decorator, Node } from "cc";
import { menu } from "db://pts-core/scripts/pTSAsset";
import { editor_property } from "db://pts-core/scripts/utils/pClass";
import { Enums_EByTo } from "db://pts-core/scripts/helper/Enums/Enums.TweenOption";
import { Type_CCEasing } from "db://pts-core/scripts/Components/Type/Type.Easing";
import { EcsAction_Data_Mechanic_Base, EcsAction_Data_MechanicRef } from "./EcsAction.Data.Base";
import { EcsAction_Data_Target } from "./EcsAction.Data.Target";
import { EcsAction_System_Scale } from "./EcsAction.System.Motion";
import type { EcsAction_World } from "./EcsAction.World";

const { ccclass, property } = _decorator;

@ccclass('EcsAction_Data_Scale')
@menu('EcsAction/Data/Scale')
export class EcsAction_Data_Scale extends EcsAction_Data_Mechanic_Base {
    @property({ type: Vec3 })
    scale: Vec3 = v3(1, 1, 1);

    @property({ min: 0 })
    duration: number = 0;

    @property({ type: Type_CCEasing })
    easing: TweenEasing = 'smooth';

    @property({ type: Enums_EByTo })
    type: Enums_EByTo = Enums_EByTo.To;

    @editor_property(Vec3)
    startScale: Vec3 = v3(1, 1, 1);

    @editor_property()
    elapsed: number = 0;

    @editor_property()
    isStarted: boolean = false;

    @editor_property()
    isDoneFlag: boolean = false;

    mount(world: EcsAction_World, entity: number, target: Node): void {
        world.ensureComponent(EcsAction_Data_Scale);
        world.ensureComponent(EcsAction_Data_Target);
        world.ensureComponent(EcsAction_Data_MechanicRef);

        world.ensureSystem(EcsAction_System_Scale, [EcsAction_Data_Target, EcsAction_Data_Scale]);

        const targetData = new EcsAction_Data_Target();
        targetData.target = target;
        world.addComponent(entity, EcsAction_Data_Target, targetData);

        const mechRef = new EcsAction_Data_MechanicRef();
        mechRef.action = this;
        this.isActive = false;
        world.addComponent(entity, EcsAction_Data_MechanicRef, mechRef);

        world.addComponent(entity, EcsAction_Data_Scale, this);
    }

    isDone(world: EcsAction_World, entity: number): boolean {
        return this.isDoneFlag || (this.duration <= 0 && this.isStarted);
    }

    reset(world: EcsAction_World, entity: number): void {
        this.elapsed = 0;
        this.isStarted = false;
        this.isDoneFlag = false;
        this.isActive = false;
    }
}
