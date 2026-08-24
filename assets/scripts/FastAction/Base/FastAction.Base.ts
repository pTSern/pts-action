import { _decorator, CCInteger, tween, Tween } from 'cc';
import { pArray, pAsync, pConst } from 'db://pts-core/scripts/utils';
import { DEV } from 'cc/env';
import { editor_property } from 'db://pts-core/scripts/utils/pClass';
import { Event_Flexer } from 'db://pts-core/scripts/Components/Event/Event.Flexer';
import { register } from './FastAction.Pool';
import { Smart_StartUp } from 'db://pts-core/scripts/Components/Smart/Smart.StartUp';

const { ccclass, property } = _decorator;

@ccclass('FastAction_Base')
export abstract class FastAction_Base<_TTarget extends object> extends Smart_StartUp {
    protected static _$list = ['_mechanic'];

    static stop(action: pFlex.TArray<FastAction_Base<any>>, clean: boolean = false) {
        const actions = pArray.flatter(action);
        for(const _ of actions) {
            _.stop(clean)
        }
    }
    static execute(action: pFlex.TArray<FastAction_Base<any>>, target?: any) {
        const actions = pArray.flatter(action);

        const _arr = [];
        for(const _ of actions) {
            _.setNewTarget(target);
            _ && _.isValid && _arr.push(_.execute());
        }

        return Promise.all(_arr)
    }

    abstract target: _TTarget
    @property({ min: 0, group: pConst.GROUPS.CORE })
    predelay: number = 0;

    @property({ min: 0, group: pConst.GROUPS.CORE })
    interval: number = 0;

    @property({ type: CCInteger, min: 0, group: pConst.GROUPS.CORE })
    looper: number = 1;

    @property({ group: pConst.GROUPS.CORE })
    isAlwayRecalculate: boolean = false;

    @property({ type: Event_Flexer, group: pConst.GROUPS.EVENT })
    onEachComplete: Event_Flexer = new Event_Flexer();

    @property({ type: Event_Flexer, group: pConst.GROUPS.EVENT })
    onFullyComplete: Event_Flexer = new Event_Flexer();

    @editor_property(pAsync.Task)
    protected _task: pAsync.Task = pAsync.Task.create();

    protected _tween: Tween<_TTarget> = null
    protected _handler: pFlex.TFunc = null;

    setNewTarget(target: _TTarget) {
        if(!target) return;
        if(this.target === target) return;

        this.target = target;
        this._tween?.target(target)
    }

    constructor() {
        super();
        register(this.constructor)
    }

    protected _onPreLoad(): void {
        this.target = this.target || this.node as unknown as _TTarget;
        //if(!this.target) {
        //    this.destroy();
        //    return;
        //}

        this._handler = this.isAlwayRecalculate ? () => {
            this._generate();
            DEV && console.log(`[${this.name}] execute time: ${this._intRunTime}`);
            this._tween?.start();
        } : ( this._generate(), () => {
            DEV && console.log(`[${this.name}] execute time: ${this._intRunTime}`);
            this._tween?.start();
        })
    }

    protected _onDestroy(): void {
        this.stop(true);
    }

    protected _generate() {
        this._tween = tween(this.target);
        const _origin = tween(this.target).delay(this.interval);
        const _tween =
            this._mechanic(_origin)
            .call( () => {
                this._task.resolve();
                this.onEachComplete.emit();
            });

        this.looper <= 0 ? this._tween.repeatForever(_tween) : this._tween.repeat(this.looper, _tween);
        !this.onFullyComplete.empty() && this._tween.call( () => this.onFullyComplete.emit() )
    }

    stop(clean: boolean = false) {
        super.stop();

        clean ? this.unscheduleAllCallbacks() : this.unschedule(this._handler);
        this._task.abort();
        this._tween?.stop();
        this._task.recycle();
        this._task = pAsync.Task.create();
        clean && this.target && Tween.stopAllByTarget(this.target);
    }

    protected _onExecute() {
        if(!this._handler) {
            this._task.resolve();
            return this._task.wait();
        }
        this.scheduleOnce(this._handler, this.predelay);
        return this._task.wait();
    }

    protected abstract _mechanic(origin: Tween<_TTarget>): Tween<_TTarget>
}
