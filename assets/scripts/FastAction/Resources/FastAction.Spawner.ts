
import { Node, Tween, _decorator } from 'cc'
import { FastAction_Base } from '../Base/FastAction.Base';
import { Helper_Spawner } from 'db://pts-core/scripts/helper/Common/Helper.Spawner';
import { pConst } from 'db://pts-core/scripts/utils';

const { ccclass, property } = _decorator;

@ccclass("FastAction_Spawner")
export class FastAction_Spawner extends FastAction_Base<Node> {
    target: Node = null;

    @property({ type: Helper_Spawner, group: pConst.GROUPS.HELPER })
    spawner: Helper_Spawner = new Helper_Spawner();

    protected _mechanic(origin: Tween<Node>): Tween<Node> {
        return origin.call(() => this.spawner.spawn());
    }

    protected _onLoad(): void {
        this.target = this.target || this.node;
        this.spawner.init();
    }

}
