
import { _decorator, Node, Prefab } from 'cc';
import { Smart_StartUp } from './Smart.StartUp';
import { pConst, pEngine } from 'db://pts-core/scripts/utils';

const { ccclass, property } = _decorator;

@ccclass('Smart_Creator')
export class Smart_Creator extends Smart_StartUp {
    @property({ type: Node, group: pConst.GROUPS.CORE })
    container: Node = null;

    @property({ type: Prefab, group: pConst.GROUPS.CORE })
    fabs: Prefab[] = [];

    protected _onExecute(): Promise<void> | void {
        this.fabs.forEach(fab => {
            pEngine.NodeUtils.create({
                fab,
                parent: this.container,
            });
        })
    }

    protected _onPause(): void {
    }

    protected _onResume(): void {
    }

    protected _onStop(): void {
    }
}
