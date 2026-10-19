import { director, js } from "cc";
import { EDITOR, EDITOR_NOT_IN_PREVIEW } from "cc/env";
import { pECS, _ComponentManager, _SystemManager, _System } from "db://pts-core/scripts/utils/pECS";
import { editor_ccclass } from "db://pts-core/scripts/utils/pClass";
import { EcsAction_Data_Chain } from "./EcsAction.Data.Chain";
import { EcsAction_Data_Target } from "./EcsAction.Data.Target";
import { EcsAction_Data_Sequence } from "./EcsAction.Data.Sequence";
import { EcsAction_Data_ConditionRef, EcsAction_Data_MechanicRef } from "./EcsAction.Data.Base";
import { EcsAction_System_Sequence } from "./EcsAction.System.Sequence";
import { pGlobal } from "db://pts-core/scripts/utils";

export interface IEcsActionSystemUpdater {
    system: _System;
    update: (dt: number, compMgr: _ComponentManager) => void;
}

@editor_ccclass('EcsAction_World')
export class EcsAction_World {
    private static _instance: EcsAction_World;
    static get instance(): EcsAction_World {
        return this._instance ??= new EcsAction_World();
    }

    id: string = js.IDGenerator.global.getNewId()
    readonly queue = new pECS.Queue(5000);
    readonly compMgr = new _ComponentManager();
    readonly sysMgr = new _SystemManager();

    private _systemUpdaters: IEcsActionSystemUpdater[] = [];
    private _isInitialized: boolean = false;

    constructor() {
        this.init();
    }

    init(): void {
        if (this._isInitialized) return;

        // 1. Register foundational infrastructure component types
        this.ensureComponent(EcsAction_Data_Chain);
        this.ensureComponent(EcsAction_Data_Target);
        this.ensureComponent(EcsAction_Data_Sequence);
        this.ensureComponent(EcsAction_Data_ConditionRef);
        this.ensureComponent(EcsAction_Data_MechanicRef);

        // 2. Register core sequence system
        this.ensureSystem(EcsAction_System_Sequence, [EcsAction_Data_Chain, EcsAction_Data_Sequence]);

        // 3. Hook single update tick into Cocos scheduler
        if (!EDITOR || !EDITOR_NOT_IN_PREVIEW) {
            director.getScheduler().scheduleUpdate(this, 0, false);
        }

        this._isInitialized = true;
    }

    /**
     * Ensures a component type is registered in ComponentManager.
     */
    ensureComponent<T>(compClass: pFlex.TCtor<any, T>): void {
        try {
            this.compMgr.type(compClass);
        } catch {
            this.compMgr.register(compClass);
        }
    }

    /**
     * Dynamically registers a system and computes its bitmask signature.
     */
    ensureSystem<T extends _System>(
        systemClass: pFlex.TCtor<any, T>,
        requiredCompClasses: pFlex.TCtor<any, any>[]
    ): T {
        let requiredBitmask = 0;
        for (const compClass of requiredCompClasses) {
            this.ensureComponent(compClass);
            requiredBitmask |= (1 << this.compMgr.type(compClass));
        }

        try {
            return this.sysMgr['system.get'](systemClass);
        } catch {
            const system = this.sysMgr['system.register'](systemClass);
            this.sysMgr['signature.set'](systemClass, requiredBitmask);

            if ('update' in system && typeof (system as any).update === 'function') {
                this._systemUpdaters.push({
                    system,
                    update: (dt, compMgr) => (system as any).update(dt, compMgr)
                });
            }

            return system;
        }
    }

    createEntity(): number {
        return this.queue['entity.create']();
    }

    addComponent<T>(entity: number, compClass: pFlex.TCtor<any, T>, data: T): void {
        this.ensureComponent(compClass);
        this.compMgr.add(entity, compClass, data);
        const compType = this.compMgr.type(compClass);

        const currentSig = this.queue['signature.get'](entity);
        const newSig = currentSig | (1 << compType);
        this.queue['signature.set'](entity, newSig);

        this.sysMgr['entity.signature.change'](entity, newSig);
    }

    removeComponent<T>(entity: number, compClass: pFlex.TCtor<any, T>): void {
        this.compMgr.remove(entity, compClass);
        const compType = this.compMgr.type(compClass);

        const currentSig = this.queue['signature.get'](entity);
        const newSig = currentSig & ~(1 << compType);
        this.queue['signature.set'](entity, newSig);

        this.sysMgr['entity.signature.change'](entity, newSig);
    }

    getComponent<T>(entity: number, compClass: pFlex.TCtor<any, T>): T | undefined {
        try {
            return this.compMgr.get(entity, compClass);
        } catch {
            return undefined;
        }
    }

    destroyEntity(entity: number): void {
        this.compMgr.destroy(entity);
        this.sysMgr['entity.destroy'](entity);
        this.queue['entity.destroy'](entity);
    }

    update(dt: number): void {
        for (let i = 0; i < this._systemUpdaters.length; i++) {
            this._systemUpdaters[i].update(dt, this.compMgr);
        }
    }
}
