import { _decorator, Component } from 'cc';
import { pTSAction_Manager_Condition } from './pTSAction.Manager.Condition';
import { pTSAction_Manager_Mechanic } from './pTSAction.Manager.Mechanic';
import { EDITOR, EDITOR_NOT_IN_PREVIEW } from 'cc/env';
import { implement, pAsync, pConst } from 'db://pts-core/scripts/utils';
import { Event_Flexer } from 'db://pts-core/scripts/Components/Event/Event.Flexer';
import { Event_Awaitable } from 'db://pts-core/scripts/Components/Event/Event.Awaitable';
import { editor_property } from 'db://pts-core/scripts/utils/pClass';

const { ccclass, property } = _decorator;

@implement(Event_Awaitable)
@ccclass('pTSAction_Manager_Component')
export class pTSAction_Manager_Component extends Component implements Event_Awaitable {
    @property({ type: pTSAction_Manager_Condition, group: pConst.GROUPS.CORE })
    condition: pTSAction_Manager_Condition = new pTSAction_Manager_Condition();

    @property({ type: pTSAction_Manager_Mechanic, group: pConst.GROUPS.CORE })
    mechanic: pTSAction_Manager_Mechanic = new pTSAction_Manager_Mechanic();

    @property({ type: Event_Flexer, group: pConst.GROUPS.EVENT })
    onComplete: Event_Flexer = new Event_Flexer();

    @editor_property(pAsync.Task)
    protected _task: pAsync.Task = pAsync.Task.create();

    protected onLoad(): void {
        if(EDITOR && EDITOR_NOT_IN_PREVIEW) return;

        this.condition.init(this.node);
        this.mechanic.init(this.node);
        this.condition.on('onReady', { func: this.mechanic.execute, binder: this.mechanic });
        this.mechanic.on('onComplete', { func: this._onMechanicComplete, binder: this });
        this._task.recycle();
    }

    protected _onMechanicComplete(manager: pTSAction_Manager_Mechanic) {
        if(manager !== this.mechanic) return;

        this._task.resolve();
        this.onComplete.emit();
    }

    protected onDestroy(): void {
        this.condition.off('onReady', { func: this.mechanic.execute, binder: this.mechanic });

        this.condition.release();
        this.mechanic.release();
        this._task.abort();
    }

    protected update(dt: number): void {
        this.condition.tick(dt);
    }

    wait(): Promise<any> {
        return this._task.wait();
    }
}
