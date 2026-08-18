import { _decorator, Node, Tween, Vec3 } from 'cc';
import { FastAction_Base } from '../Base/FastAction.Base';
import { pConst } from 'db://pts-core/scripts/utils';
import { Helper_Vec3 } from 'db://pts-core/scripts/helper/Common/Helper.Vec3';

const { ccclass, property } = _decorator;

@ccclass('FastAction_Moving')
export class FastAction_Moving extends FastAction_Base<Node> {

    @property({ type: Node, group: pConst.GROUPS.CORE })
    target: Node = null;

    @property({ min: 0, group: pConst.GROUPS.CORE })
    speed: number = 0

    @property({ type: Helper_Vec3, group: pConst.GROUPS.CORE })
    helpers: Helper_Vec3[] = []

    protected _mechanic(origin: Tween<Node>): Tween<Node> {
        let _cp = (this.target ? this.target.position : this.node.position).clone();
        const _pn = this.target ? this.target.parent : this.node.parent;

        return this.helpers.reduce((_, _cur) => {
            const _pos = _cur.getAsPosition(false, _pn);
            let _dur = _cur.duration;

            if (this.speed > 0) {
                const distance = Vec3.distance(_cp, _pos);
                _dur = distance / this.speed;
            }

            _ = _cur.tween<Node>(_, 'position', _h => _pos, _dur);
            _cp = _pos.clone();
            return _;
        }, origin);
    }

    protected _onPause(): void {
    }

    protected _onResume(): void {
    }

    protected _onStop(): void {
    }
}
