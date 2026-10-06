import { _decorator, Component } from 'cc';
import { pTSAction_Manager_Condition } from './pTSAction.Manager.Condition';
import { pTSAction_Manager_Mechanic } from './pTSAction.Manager.Mechanic';
import { EDITOR, EDITOR_NOT_IN_PREVIEW } from 'cc/env';
import { implement, pAsync, pConst } from 'db://pts-core/scripts/utils';
import { Event_Flexer } from 'db://pts-core/scripts/Components/Event/Event.Flexer';
import { Event_Awaitable } from 'db://pts-core/scripts/Components/Event/Event.Awaitable';
import { editor_property } from 'db://pts-core/scripts/utils/pClass';
import { pTSAction_Manager_Holder } from './pTSAction.Manager.Holder';

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

    @property({ type: pTSAction_Manager_Holder, group: pConst.GROUPS.get("Holder") })
    holders: pTSAction_Manager_Holder[] = [];

    @editor_property(pAsync.Task)
    protected _task: pAsync.Task = pAsync.Task.create();

    protected onLoad(): void {
        if(EDITOR && EDITOR_NOT_IN_PREVIEW) return;

        this.condition.on('onReady', { func: this.mechanic.execute, binder: this.mechanic });
        this.mechanic.on('onComplete', { func: this._onMechanicComplete, binder: this });
        this.holders.forEach(holder => holder.bind(this));
        this._task.recycle();
    }

    protected onEnable(): void {
        this.condition.init(this.node);
        this.mechanic.init(this.node);
        this._task.recycle();
    }

    protected onDisable(): void {
        this._task.abort();
        this.condition.stop();
        this.mechanic.stop();
    }

    protected _onMechanicComplete(manager: pTSAction_Manager_Mechanic) {
        if(manager !== this.mechanic) return;

        this._task.resolve();
        this.onComplete.emit();
    }

    protected onDestroy(): void {
        this.holders.forEach(holder => holder.unbind(this));
        this.condition.off('onReady', { func: this.mechanic.execute, binder: this.mechanic });

        this.condition.release();
        this.mechanic.release();
    }

    protected update(dt: number): void {
        this.condition.tick(dt);
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
