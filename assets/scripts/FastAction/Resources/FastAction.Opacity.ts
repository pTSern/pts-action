import { _decorator, Tween, UIOpacity } from 'cc';
import { FastAction_Base } from '../Base/FastAction.Base';
import { pConst } from 'db://pts-core/scripts/utils';
import { Helper_Value } from 'db://pts-core/scripts/helper/Common/Helper.Value';

const { ccclass, property } = _decorator;

@ccclass('FastAction_Opacity')
export class FastAction_Opacity extends FastAction_Base<UIOpacity> {
    @property({ type: UIOpacity, group: pConst.GROUPS.CORE })
    target: UIOpacity = null;

    @property({ type: Helper_Value, group: pConst.GROUPS.CORE })
    helpers: Helper_Value[] = []

    protected _mechanic(origin: Tween<UIOpacity>): Tween<UIOpacity> {
        return this.helpers.reduce((_, _cur) => {
            _ = _cur.tween<UIOpacity>(_, 'opacity');
            return _
        }, origin)
    }
}
