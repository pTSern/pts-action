
import { _decorator, Node, Tween } from 'cc';
import { FastAction_Base } from '../Base/FastAction.Base';
import { pConst } from 'db://pts-core/scripts/utils';
import { Helper_Vec3 } from 'db://pts-core/scripts/helper/Common/Helper.Vec3';

const { ccclass, property } = _decorator;

@ccclass('FastAction_Scaling')
export class FastAction_Scaling extends FastAction_Base<Node> {
    protected _onPause(): void {
    }
    protected _onResume(): void {
    }
    protected _onStop(): void {
    }
    @property({ type: Node, group: pConst.GROUPS.CORE })
    target: Node = null;

    @property({ type: Helper_Vec3, group: pConst.GROUPS.CORE })
    helpers: Helper_Vec3[] = []

    protected _mechanic(origin: Tween<Node>): Tween<Node> {
        return this.helpers.reduce((_, _cur) => {
            _ = _cur.tween<Node>(_, 'scale', _h => _h.objTarget ? _h.objTarget.scale : _h.vecTarget);
            return _
        }, origin)
    }
}
