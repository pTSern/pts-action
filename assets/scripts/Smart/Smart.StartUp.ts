
import { CCInteger, JsonAsset, _decorator, js, misc, } from "cc";
import { Enums_EStartUp } from "../Enums/Enums.StartUp";
import { pConst, pEngine } from "db://pts-core/scripts/utils";
import { editor_property } from "db://pts-core/scripts/utils/pClass";
import { Event_Flexer } from "db://pts-core/scripts/Components/Event/Event.Flexer";
import { Editor_PleaseOverride } from "db://pts-core/scripts/editor/Smart/Editor.PleaseOverride";

const { ccclass, property } = _decorator;

@ccclass("Smart_StartUp")
export abstract class Smart_StartUp extends Editor_PleaseOverride {

    @property({ group: pConst.GROUPS.get('Description', '1', 0), visible: true, multiline: true, editorOnly: true, displayName: "Description" })
    protected _$desc: string = "Edit me"

    @property({ type: Enums_EStartUp, group: pConst.GROUPS.CORE })
    mode: Enums_EStartUp = Enums_EStartUp.None;

    @property({ type: JsonAsset, group: pConst.GROUPS.get('Hooker') })
    starters: JsonAsset[] = [];

    @property({ min: 0, type: CCInteger, group: pConst.GROUPS.CORE })
    intMaxRunTime: number = 1;

    @property({ group: pConst.GROUPS.CORE })
    isStackExecution: boolean = false

    @property({ type: JsonAsset, group: pConst.GROUPS.get('Hooker') })
    stoppers: JsonAsset[] = []

    @property({ type: JsonAsset, group: pConst.GROUPS.get('Hooker') })
    destroyers: JsonAsset[] = []

    @property({ type: JsonAsset, group: pConst.GROUPS.get('Hooker') })
    pausers: JsonAsset[] = []

    @property({ type: JsonAsset, group: pConst.GROUPS.get('Hooker') })
    resumers: JsonAsset[] = []

    @property({ type: Event_Flexer, group: pConst.GROUPS.EVENT })
    onExecute: Event_Flexer = new Event_Flexer();

    @property({ type: Event_Flexer, group: pConst.GROUPS.EVENT })
    onEnd: Event_Flexer = new Event_Flexer();

    @editor_property()
    protected _intRunTime: number = 0;

    protected _onLoad?(): void
    protected _onEnable?(): void
    protected _onStart?(): void
    protected _onDisable?(): void
    protected _onDestroy?(): void

    protected static _$list = ['_onExecute'];

    protected abstract _onExecute(...args: any[]): Promise<void> | void
    @editor_property()
    protected _isExecuting: boolean = false;
    @editor_property()
    protected _stacked: number = 0;

    async execute(...args: any[]) {
        if (!this.isValid || !pEngine.CompUtils.isOnLoaded(this) || !this.uuid) {
            console.warn(
                `${this.name}__[${js.getClassName(this)}] is not valid to execute.\nData: [isValid, isOnLoaded, uuid]`,
                [this.isValid, pEngine.CompUtils.isOnLoaded(this), this.uuid],
            );
            return;
        }

        if (this.intMaxRunTime <= 0 || this._intRunTime < this.intMaxRunTime) {
            if(this._isExecuting) {
                this.isStackExecution && (this._stacked ++);
                return;
            }

            this.stop();
            this._intRunTime++;
            this._isExecuting = true;

            this.onExecute.emit(...args);
            await this._onExecute(...args);
            this._isExecuting = false;
            if(this._stacked > 0) {
                this.execute(...args);
                this._stacked --;
                return;
            }
            this.onEnd.emit();
            return;
        }

        return
    }

    stop(): void {
        this._stacked = 0;
        this._onStop?.();
    }

    pause() {
        this._onPause?.();
    }

    resume() {
        this._onResume?.();
    }

    protected abstract _onPause(): void
    protected abstract _onResume(): void
    protected abstract _onStop(): void

    protected __preload(): void {
        pEngine.Json.event.add(this.stoppers, { func: this.stop, binder: this })
        pEngine.Json.event.add(this.starters, { func: this.execute, binder: this })
        pEngine.Json.event.add(this.pausers, { func: this.pause, binder: this })
        pEngine.Json.event.add(this.resumers, { func: this.resume, binder: this })
        pEngine.Json.event.add(this.destroyers, { func: this.actSafeDestroy, binder: this })

        this._onPreLoad?.();
        if(this.mode === Enums_EStartUp.None) return;
        if(this.mode === Enums_EStartUp.PreLoad) { this.execute(); return; }

        const _origin = this[this.mode];
        this[this.mode] = () => {
            _origin.call(this);
            this.execute();
        }

    }

    protected _onPreLoad?(): void

    protected onLoad(): void {
        this._onLoad?.();
    }

    protected onEnable(): void {
        this._onEnable?.() 
    }

    protected start(): void {
        this._onStart?.();
    }

    protected onDisable(): void {
        this.pause();
        this._onDisable?.();
    }

    protected onDestroy(): void {
        this.stop();
        this._onDestroy?.()

        pEngine.Json.event.remove(this.stoppers, { func: this.stop, binder: this })
        pEngine.Json.event.remove(this.starters, { func: this.execute, binder: this })
        pEngine.Json.event.remove(this.pausers, { func: this.pause, binder: this })
        pEngine.Json.event.remove(this.resumers, { func: this.resume, binder: this })
        pEngine.Json.event.remove(this.destroyers, { func: this.actSafeDestroy, binder: this })
    }

    actSafeDestroy() {
        this.stop();
        this._onPreSafeDestroy?.();

        misc.callInNextTick( () => this.destroy());
    }

    protected _onPreSafeDestroy?(): void
}
