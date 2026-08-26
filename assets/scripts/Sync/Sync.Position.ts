import { _decorator, Node } from 'cc';
import { Smart_StartUp } from 'db://pts-core/scripts/Components/Smart/Smart.StartUp';

const { ccclass, property } = _decorator;

@ccclass('Sync_Position')
export class Sync_Position extends Smart_StartUp {
    @property({ type: Node })
    origin: Node = null;
    @property({ type: Node })
    targets: Node[] = [];

    protected _onExecute(): Promise<void> | void {
        if (!this.origin) return;
        const _wpos = this.origin.getWorldPosition().clone();
        for (const _target of this.targets) {
            _target.setWorldPosition(_wpos);
        }
    }

    protected _onPause(): void {
    }

    protected _onResume(): void {
    }

    protected _onStop(): void {
    }
}
