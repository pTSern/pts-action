import { _decorator, Component, Node, CCInteger, Enum } from 'cc';
import { EDITOR, EDITOR_NOT_IN_PREVIEW } from 'cc/env';
import { implement, pAsync, pConst, pTSAsset } from 'db://pts-core/scripts/utils';
import { Event_Flexer } from 'db://pts-core/scripts/Components/Event/Event.Flexer';
import { Event_Awaitable } from 'db://pts-core/scripts/Components/Event/Event.Awaitable';
import { editor_property } from 'db://pts-core/scripts/utils/pClass';
import { EcsAction_World } from './EcsAction.World';
import { EcsAction_Data_Chain, EEcsConditionLogic } from './EcsAction.Data.Chain';
import { EcsAction_Data_Target } from './EcsAction.Data.Target';
import { EcsAction_Data_Sequence, EcsAction_EExecutionMode } from './EcsAction.Data.Sequence';
import { EcsAction_Data_Condition_Base, EcsAction_Data_Mechanic_Base } from './EcsAction.Data.Base';
import { EcsAction_Holder } from './EcsAction.Holder';

const { ccclass, property } = _decorator;

@implement(Event_Awaitable)
@ccclass('EcsAction_Component')
export class EcsAction_Component extends Component implements Event_Awaitable {

    @property({ type: Node, group: pConst.GROUPS.CORE })
    target: Node = null;

    @property({ min: 0, type: CCInteger, group: pConst.GROUPS.CORE })
    loop: number = 1;

    @property({ min: 0, type: CCInteger, group: pConst.GROUPS.CORE })
    maxRunTime: number = 1;

    @property({ group: pConst.GROUPS.CORE, type: EcsAction_EExecutionMode })
    executionMode: EcsAction_EExecutionMode = EcsAction_EExecutionMode.SEQUENCE;

    @property({ group: pConst.GROUPS.CORE, type: Enum(EEcsConditionLogic) })
    conditionLogic: EEcsConditionLogic = EEcsConditionLogic.AND;

    @property({ group: pConst.GROUPS.CORE })
    clone: boolean = true;

    // ---- Polymorphic Action Lists (100% Extensible without modifying this component) ----
    @property({ type: [EcsAction_Data_Condition_Base], group: pConst.GROUPS.CORE })
    conditions: EcsAction_Data_Condition_Base[] = [];

    @property({ type: [EcsAction_Data_Mechanic_Base], group: pConst.GROUPS.CORE })
    mechanics: EcsAction_Data_Mechanic_Base[] = [];

    // ---- Events & Holders ----
    @property({ type: Event_Flexer, group: pConst.GROUPS.EVENT })
    onComplete: Event_Flexer = new Event_Flexer();

    @property({ type: EcsAction_Holder, group: pConst.GROUPS.get("Holder") })
    holders: EcsAction_Holder[] = [];

    @editor_property(pAsync.Task)
    protected _task: pAsync.Task = pAsync.Task.create();

    protected _isStarted: boolean = false;
    protected _rootEntity: number = -1;
    protected _childEntities: number[] = [];

    protected _activeConditions: EcsAction_Data_Condition_Base[] = [];
    protected _activeMechanics: EcsAction_Data_Mechanic_Base[] = [];

    protected onLoad(): void {
        if (EDITOR && EDITOR_NOT_IN_PREVIEW) return;
        this.holders.forEach(h => h.bind(this));
        this._task.recycle();
    }

    protected start(): void {
        if (EDITOR && EDITOR_NOT_IN_PREVIEW) return;
        this._isStarted = true;
        this._task.recycle();
        this._setupEcsEntities();
    }

    protected onEnable(): void {
        if (EDITOR && EDITOR_NOT_IN_PREVIEW) return;
        if (this._isStarted && this._rootEntity < 0) {
            this._task.recycle();
            this._setupEcsEntities();
        }
    }

    protected onDisable(): void {
        this._task.abort();
        this._teardownEcsEntities();
    }

    protected onDestroy(): void {
        this.holders.forEach(h => h.unbind(this));
        this._teardownEcsEntities();
    }

    private _setupEcsEntities(): void {
        const world = EcsAction_World.instance;
        const targetNode = this.target || this.node;

        // 1. Clone assets for runtime instance isolation if requested
        [this._activeConditions, this._activeMechanics] = this.clone
            ? [
                  pTSAsset.clone(this.conditions).filter(c => c && c.enabled),
                  pTSAsset.clone(this.mechanics).filter(m => m && m.enabled)
              ]
            : [
                  this.conditions.filter(c => c && c.enabled),
                  this.mechanics.filter(m => m && m.enabled)
              ];

        // 2. Allocate Root Entity
        this._rootEntity = world.createEntity();

        const chainData = new EcsAction_Data_Chain();
        chainData.maxLoops = this.loop;
        chainData.maxRuntime = this.maxRunTime;
        chainData.conditionLogic = this.conditionLogic;
        chainData.state = this._activeConditions.length > 0 ? 'evaluating' : 'executing';
        chainData.onComplete = () => {
            this._task.resolve();
            this.onComplete.emit();
        };
        world.addComponent(this._rootEntity, EcsAction_Data_Chain, chainData);

        const targetData = new EcsAction_Data_Target();
        targetData.target = targetNode;
        targetData.origin = this.node;
        world.addComponent(this._rootEntity, EcsAction_Data_Target, targetData);

        // 3. Mount all active conditions to Root Entity
        for (const cond of this._activeConditions) {
            cond.mount(world, this._rootEntity, targetNode);
        }

        // 4. Mount all active mechanics to individual child entities (initially sleeping/inactive)
        this._childEntities = [];
        for (const mech of this._activeMechanics) {
            const childEntity = world.createEntity();
            mech.mount(world, childEntity, targetNode);
            this._childEntities.push(childEntity);
        }

        // 5. Attach Sequence Data to Root Entity
        const seqData = new EcsAction_Data_Sequence();
        seqData.mode = this.executionMode;
        seqData.childEntities = [...this._childEntities];
        world.addComponent(this._rootEntity, EcsAction_Data_Sequence, seqData);

        // 6. If no conditions exist, immediately wake mechanics according to executionMode
        if (chainData.state === 'executing') {
            seqData.activateCurrent(world.compMgr);
        }
    }

    private _teardownEcsEntities(): void {
        const world = EcsAction_World.instance;

        for (const child of this._childEntities) {
            world.destroyEntity(child);
        }
        this._childEntities = [];

        if (this._rootEntity >= 0) {
            world.destroyEntity(this._rootEntity);
            this._rootEntity = -1;
        }

        if (this.clone) {
            this._activeConditions.forEach(c => c.destroy());
            this._activeMechanics.forEach(m => m.destroy());
        }
        this._activeConditions = [];
        this._activeMechanics = [];
    }

    async wait(): Promise<void> {
        if (!this.isValid || !this.enabledInHierarchy) return;

        while (true) {
            const currentWait = this._task.wait();
            await currentWait;

            if (this._task.state === 'resolved' || !this.isValid || !this.enabledInHierarchy) return;
            if (this._task.state !== 'pending') return;
        }
    }
}
