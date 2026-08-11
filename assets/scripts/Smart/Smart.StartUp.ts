
import { CCInteger, _decorator, js, misc, } from "cc";
import { Enums_EStartUp } from "../Enums/Enums.StartUp";
import { pConst, pEngine } from "db://pts-core/scripts/utils";
import { editor_property } from "db://pts-core/scripts/utils/pClass";
import { Event_Flexer } from "db://pts-core/scripts/Components/Event/Event.Flexer";
import { Editor_PleaseOverride } from "db://pts-core/scripts/editor/Smart/Editor.PleaseOverride";

const { ccclass, property } = _decorator;

@ccclass("Smart_StartUp")
export abstract class Smart_StartUp extends Editor_PleaseOverride {

    @property({ group: pConst.GROUPS.get('Description', '1', 10), visible: true, multiline: true, editorOnly: true, displayName: "Description" })
    protected _$desc: string = "Edit me"

    @property({ type: Enums_EStartUp, group: pConst.GROUPS.CORE })
    mode: Enums_EStartUp = Enums_EStartUp.None;

    @property({ type: Event_Flexer, group: pConst.GROUPS.EVENT })
    starter: Event_Flexer = new Event_Flexer();

    @property({ min: 0, type: CCInteger, group: pConst.GROUPS.CORE })
    intMaxRunTime: number = 1;

    @property({ group: pConst.GROUPS.CORE })
    isStackExecution: boolean = false

    @property({ type: Event_Flexer, group: pConst.GROUPS.EVENT })
    stopper: Event_Flexer = new Event_Flexer();

    @property({ type: Event_Flexer, group: pConst.GROUPS.EVENT })
    destroyer: Event_Flexer = new Event_Flexer();

    @property({ type: Event_Flexer, group: pConst.GROUPS.get('Listener') })
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

    protected _onPause?(): void
    protected _onResume?(): void
    protected _onStop?(): void

    protected __preload(): void {
        pEngine.Json.event.add(this.stopper.json, { func: this.stop, binder: this })
        pEngine.Json.event.add(this.starter.json, { func: this.execute, binder: this })
        pEngine.Json.event.add(this.destroyer.json, { func: this.actSafeDestroy, binder: this })

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
        pEngine.Json.event.remove(this.stopper.json, { func: this.stop, binder: this })
        pEngine.Json.event.remove(this.starter.json, { func: this.execute, binder: this })
        pEngine.Json.event.remove(this.destroyer.json, { func: this.actSafeDestroy, binder: this })

        this._onDisable?.();
    }

    protected onDestroy(): void {
        this._onDestroy?.()
    }

    actSafeDestroy() {
        this.stop();
        this._onPreSafeDestroy?.();

        misc.callInNextTick( () => this.destroy());
    }

    protected _onPreSafeDestroy?(): void
}
